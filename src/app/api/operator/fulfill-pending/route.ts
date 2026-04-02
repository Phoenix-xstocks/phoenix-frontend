import { NextResponse } from 'next/server';
import {
  createWalletClient,
  createPublicClient,
  http,
  decodeEventLog,
  type Account,
  type PublicClient,
  type WalletClient,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { nonceManager } from 'viem';
import { inkSepolia } from '@/lib/chains';
import { CONTRACTS } from '@/lib/contracts';
import { FLAGSHIP_BASKET } from '@/lib/constants';

const TOTAL_FEE_BPS = 60n;
const PRICING_TIMEOUT_SEC = 120;
const PRICING_POLL_INTERVAL_MS = 3000;

async function fulfillRequest(
  requestId: bigint,
  account: Account,
  publicClient: PublicClient,
  walletClient: WalletClient,
) {
  // Read the request
  const reqData = (await publicClient.readContract({
    address: CONTRACTS.XYieldVault.address,
    abi: CONTRACTS.XYieldVault.abi,
    functionName: 'requests',
    args: [requestId],
  })) as readonly [
    `0x${string}`,
    `0x${string}`,
    bigint,
    `0x${string}`,
    bigint,
    bigint,
    number,
  ];

  const [, receiver, amount, , , , status] = reqData;

  // Only process pending requests (status 0)
  if (status !== 0) return null;

  const netAmount = amount - (amount * TOTAL_FEE_BPS) / 10_000n;

  // Use flagship basket as fallback (can't read dynamic arrays from mapping getter)
  const basket = [...FLAGSHIP_BASKET] as `0x${string}`[];

  // 1. createNote
  const createNoteHash = await walletClient.writeContract({
    account,
    chain: inkSepolia,
    address: CONTRACTS.AutocallEngine.address,
    abi: CONTRACTS.AutocallEngine.abi,
    functionName: 'createNote',
    args: [basket, netAmount, receiver],
  });
  const createNoteReceipt = await publicClient.waitForTransactionReceipt({
    hash: createNoteHash,
  });

  let noteId: `0x${string}` | undefined;
  for (const log of createNoteReceipt.logs) {
    try {
      const decoded = decodeEventLog({
        abi: CONTRACTS.AutocallEngine.abi,
        data: log.data,
        topics: log.topics,
      });
      if (decoded.eventName === 'NoteCreated' && 'noteId' in decoded.args) {
        noteId = decoded.args.noteId as `0x${string}`;
        break;
      }
    } catch {
      // Not a matching event
    }
  }

  if (!noteId) throw new Error(`No noteId for request ${requestId}`);

  // 2. fulfillDeposit
  const fulfillHash = await walletClient.writeContract({
    account,
    chain: inkSepolia,
    address: CONTRACTS.XYieldVault.address,
    abi: CONTRACTS.XYieldVault.abi,
    functionName: 'fulfillDeposit',
    args: [requestId, noteId, basket],
  });
  await publicClient.waitForTransactionReceipt({ hash: fulfillHash });

  // 3. Wait for Chainlink CRE to price the note
  const pricingDeadline = Date.now() + PRICING_TIMEOUT_SEC * 1000;
  let noteState = 0;

  while (Date.now() < pricingDeadline) {
    noteState = (await publicClient.readContract({
      address: CONTRACTS.AutocallEngine.address,
      abi: CONTRACTS.AutocallEngine.abi,
      functionName: 'getState',
      args: [noteId],
    })) as number;

    if (noteState >= 1) break;
    await new Promise((r) => setTimeout(r, PRICING_POLL_INTERVAL_MS));
  }

  if (noteState < 1) {
    throw new Error(`CRE pricing timed out for note ${noteId}`);
  }

  // 4. activateNote
  const activateHash = await walletClient.writeContract({
    account,
    chain: inkSepolia,
    address: CONTRACTS.AutocallEngine.address,
    abi: CONTRACTS.AutocallEngine.abi,
    functionName: 'activateNote',
    args: [noteId],
  });
  await publicClient.waitForTransactionReceipt({ hash: activateHash });

  return { requestId: Number(requestId), noteId };
}

export async function POST() {
  const operatorKey = process.env.OPERATOR_PRIVATE_KEY;
  if (!operatorKey) {
    return NextResponse.json(
      { error: 'OPERATOR_PRIVATE_KEY not configured' },
      { status: 500 },
    );
  }

  const account = privateKeyToAccount(operatorKey as `0x${string}`, {
    nonceManager,
  });
  const transport = http(inkSepolia.rpcUrls.default.http[0]);

  const publicClient = createPublicClient({
    chain: inkSepolia,
    transport,
  });

  const walletClient = createWalletClient({
    account,
    chain: inkSepolia,
    transport,
  });

  try {
    // Read how many requests exist
    const nextId = (await publicClient.readContract({
      address: CONTRACTS.XYieldVault.address,
      abi: CONTRACTS.XYieldVault.abi,
      functionName: 'nextRequestId',
    })) as bigint;

    const fulfilled: { requestId: number; noteId: string }[] = [];
    const errors: { requestId: number; error: string }[] = [];

    // Check each request
    for (let i = 0n; i < nextId; i++) {
      try {
        const result = await fulfillRequest(i, account, publicClient, walletClient);
        if (result) fulfilled.push(result);
      } catch (error) {
        errors.push({
          requestId: Number(i),
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    console.log(
      `[operator] Scanned ${nextId} requests: ${fulfilled.length} fulfilled, ${errors.length} errors`,
    );

    return NextResponse.json({ fulfilled, errors, scanned: Number(nextId) });
  } catch (error) {
    console.error('Fulfill-pending error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to scan requests',
      },
      { status: 500 },
    );
  }
}
