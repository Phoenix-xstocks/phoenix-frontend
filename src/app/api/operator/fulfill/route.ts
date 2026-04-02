import { NextRequest, NextResponse } from 'next/server';
import {
  createWalletClient,
  createPublicClient,
  http,
  decodeEventLog,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { inkSepolia } from '@/lib/chains';
import { CONTRACTS } from '@/lib/contracts';

const TOTAL_FEE_BPS = 60n; // 0.6%

// Hardcoded initial prices for hackathon (NASDAQx, SPXx)
const DEFAULT_INITIAL_PRICES: bigint[] = [2557_000_000n, 62250_000_000n]; // $25.57, $622.50 (8 decimals)
const DEFAULT_PUT_PREMIUM_BPS = 1106n;

export async function POST(request: NextRequest) {
  const operatorKey = process.env.OPERATOR_PRIVATE_KEY;
  if (!operatorKey) {
    return NextResponse.json(
      { error: 'OPERATOR_PRIVATE_KEY not configured' },
      { status: 500 },
    );
  }

  const body = await request.json();
  const { requestId, basket } = body as {
    requestId: number;
    basket: string[];
  };

  if (requestId === undefined || !basket?.length) {
    return NextResponse.json(
      { error: 'requestId and basket are required' },
      { status: 400 },
    );
  }

  const account = privateKeyToAccount(operatorKey as `0x${string}`);
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
    // 1. Read the deposit request from the vault
    const reqData = (await publicClient.readContract({
      address: CONTRACTS.XYieldVault.address,
      abi: CONTRACTS.XYieldVault.abi,
      functionName: 'requests',
      args: [BigInt(requestId)],
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

    if (status !== 0) {
      return NextResponse.json(
        { error: `Request is not pending (status: ${status})` },
        { status: 400 },
      );
    }

    const netAmount = amount - (amount * TOTAL_FEE_BPS) / 10_000n;

    // 2. createNote on AutocallEngine (called by operator who has VAULT_ROLE)
    const createNoteHash = await walletClient.writeContract({
      chain: inkSepolia,
      address: CONTRACTS.AutocallEngine.address,
      abi: CONTRACTS.AutocallEngine.abi,
      functionName: 'createNote',
      args: [basket as `0x${string}`[], netAmount, receiver],
    });

    const createNoteReceipt = await publicClient.waitForTransactionReceipt({
      hash: createNoteHash,
    });

    // Extract noteId from NoteCreated event
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

    if (!noteId) {
      return NextResponse.json(
        { error: 'Failed to extract noteId from createNote tx' },
        { status: 500 },
      );
    }

    // 3. fulfillDeposit on vault
    const fulfillHash = await walletClient.writeContract({
      chain: inkSepolia,
      address: CONTRACTS.XYieldVault.address,
      abi: CONTRACTS.XYieldVault.abi,
      functionName: 'fulfillDeposit',
      args: [BigInt(requestId), noteId, basket as `0x${string}`[]],
    });
    await publicClient.waitForTransactionReceipt({ hash: fulfillHash });

    // 4. priceNoteDirect on engine
    const priceHash = await walletClient.writeContract({
      chain: inkSepolia,
      address: CONTRACTS.AutocallEngine.address,
      abi: CONTRACTS.AutocallEngine.abi,
      functionName: 'priceNoteDirect',
      args: [noteId, DEFAULT_INITIAL_PRICES, DEFAULT_PUT_PREMIUM_BPS],
    });
    await publicClient.waitForTransactionReceipt({ hash: priceHash });

    // 5. activateNote on engine
    const activateHash = await walletClient.writeContract({
      chain: inkSepolia,
      address: CONTRACTS.AutocallEngine.address,
      abi: CONTRACTS.AutocallEngine.abi,
      functionName: 'activateNote',
      args: [noteId],
    });
    await publicClient.waitForTransactionReceipt({ hash: activateHash });

    return NextResponse.json({
      success: true,
      noteId,
      txHashes: {
        createNote: createNoteHash,
        fulfillDeposit: fulfillHash,
        priceNoteDirect: priceHash,
        activateNote: activateHash,
      },
    });
  } catch (error) {
    console.error('Operator fulfill error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Operator fulfill failed',
      },
      { status: 500 },
    );
  }
}
