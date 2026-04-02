import { NextRequest, NextResponse } from 'next/server';
import {
  createWalletClient,
  createPublicClient,
  http,
  decodeEventLog,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { nonceManager } from 'viem';
import { inkSepolia } from '@/lib/chains';
import { CONTRACTS } from '@/lib/contracts';

const TOTAL_FEE_BPS = 60n; // 0.6%

// Max time to wait for CRE pricing (seconds)
const PRICING_TIMEOUT_SEC = 120;
const PRICING_POLL_INTERVAL_MS = 3000;

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
    // 1. Read the deposit request from the vault (retry up to 5 times
    //    because the RPC may not have the block yet right after tx confirmation)
    let receiver: `0x${string}` = '0x0';
    let amount = 0n;
    let status = -1;

    for (let attempt = 0; attempt < 5; attempt++) {
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

      [, receiver, amount, , , , status] = reqData;

      if (amount > 0n) break;

      // Request not found yet — wait and retry
      console.log(`[operator] Request ${requestId} not found on attempt ${attempt + 1}, retrying...`);
      await new Promise((r) => setTimeout(r, 2000));
    }

    if (amount === 0n) {
      return NextResponse.json(
        { error: `Request ${requestId} not found (amount is 0)` },
        { status: 404 },
      );
    }

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

    // 4. Wait for Chainlink CRE to price the note (triggered by RequestPricing event)
    console.log(`[operator] Waiting for CRE to price note ${noteId}...`);
    const pricingDeadline = Date.now() + PRICING_TIMEOUT_SEC * 1000;
    let noteState = 0; // Created

    while (Date.now() < pricingDeadline) {
      noteState = (await publicClient.readContract({
        address: CONTRACTS.AutocallEngine.address,
        abi: CONTRACTS.AutocallEngine.abi,
        functionName: 'getState',
        args: [noteId],
      })) as number;

      if (noteState >= 1) break; // Priced or beyond
      await new Promise((r) => setTimeout(r, PRICING_POLL_INTERVAL_MS));
    }

    if (noteState < 1) {
      console.warn(`[operator] CRE pricing timed out for note ${noteId}, state: ${noteState}`);
      return NextResponse.json({
        success: false,
        noteId,
        error: 'CRE pricing timed out — note created and fulfilled but not yet priced',
        txHashes: { createNote: createNoteHash, fulfillDeposit: fulfillHash },
      });
    }

    console.log(`[operator] Note ${noteId} priced (state: ${noteState}), activating...`);

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
