'use client';

import { useReducer, useCallback, useEffect } from 'react';
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
  useReadContract,
} from 'wagmi';
import { parseUnits, decodeEventLog } from 'viem';
import { CONTRACTS } from '@/lib/contracts';
import { inkSepolia } from '@/lib/chains';
import { useDepositRequest, RequestStatus } from './useDepositRequest';
import { useEnsureChain } from './useEnsureChain';

// --- State machine types ---

export type DepositStep =
  | 'configure' // User selecting basket + amount
  | 'approving' // USDC approve tx pending
  | 'requesting' // requestDepositWithBasket tx pending
  | 'pending' // Waiting for operator fulfillment (oracle pricing)
  | 'ready' // Deposit fulfilled, ready to claim
  | 'claiming' // claimDeposit tx pending
  | 'done' // Deposit complete, note minted
  | 'expired' // 24h passed, can refund
  | 'error'; // Error state

interface DepositState {
  step: DepositStep;
  amount: string;
  basket: `0x${string}`[];
  requestId: bigint | undefined;
  noteTokenId: bigint | undefined;
  txHash: `0x${string}` | undefined;
  error: string | undefined;
}

type DepositAction =
  | { type: 'SET_AMOUNT'; amount: string }
  | { type: 'SET_BASKET'; basket: `0x${string}`[] }
  | { type: 'START_APPROVE' }
  | { type: 'APPROVE_SENT'; txHash: `0x${string}` }
  | { type: 'APPROVE_CONFIRMED' }
  | { type: 'START_REQUEST' }
  | { type: 'REQUEST_SENT'; txHash: `0x${string}` }
  | { type: 'REQUEST_CONFIRMED'; requestId: bigint }
  | { type: 'DEPOSIT_READY' }
  | { type: 'START_CLAIM' }
  | { type: 'CLAIM_SENT'; txHash: `0x${string}` }
  | { type: 'CLAIM_CONFIRMED'; noteTokenId: bigint }
  | { type: 'EXPIRED' }
  | { type: 'ERROR'; error: string }
  | { type: 'RESET' };

const initialState: DepositState = {
  step: 'configure',
  amount: '',
  basket: [],
  requestId: undefined,
  noteTokenId: undefined,
  txHash: undefined,
  error: undefined,
};

function depositReducer(
  state: DepositState,
  action: DepositAction,
): DepositState {
  switch (action.type) {
    case 'SET_AMOUNT':
      return { ...state, amount: action.amount };
    case 'SET_BASKET':
      return { ...state, basket: action.basket };
    case 'START_APPROVE':
      return { ...state, step: 'approving', error: undefined };
    case 'APPROVE_SENT':
      return { ...state, txHash: action.txHash };
    case 'APPROVE_CONFIRMED':
      return { ...state, step: 'requesting', txHash: undefined };
    case 'START_REQUEST':
      return state;
    case 'REQUEST_SENT':
      return { ...state, txHash: action.txHash };
    case 'REQUEST_CONFIRMED':
      return {
        ...state,
        step: 'pending',
        requestId: action.requestId,
        txHash: undefined,
      };
    case 'DEPOSIT_READY':
      return { ...state, step: 'ready' };
    case 'START_CLAIM':
      return { ...state, step: 'claiming', error: undefined };
    case 'CLAIM_SENT':
      return { ...state, txHash: action.txHash };
    case 'CLAIM_CONFIRMED':
      return {
        ...state,
        step: 'done',
        noteTokenId: action.noteTokenId,
        txHash: undefined,
      };
    case 'EXPIRED':
      return { ...state, step: 'expired' };
    case 'ERROR':
      return { ...state, error: action.error, step: 'error' };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

// --- Hook ---

export function useDepositFlow() {
  const [state, dispatch] = useReducer(depositReducer, initialState);
  const { address } = useAccount();
  const { ensureChain } = useEnsureChain();

  // Check current USDC allowance for the vault
  const { data: allowance } = useReadContract({
    address: CONTRACTS.USDC.address,
    abi: CONTRACTS.USDC.abi,
    functionName: 'allowance',
    args: address ? [address, CONTRACTS.XYieldVault.address] : undefined,
    chainId: inkSepolia.id,
    query: { enabled: !!address },
  });

  // Write contract hooks
  const {
    writeContract: writeApprove,
    data: approveTxHash,
    isPending: isApproving,
    error: approveError,
  } = useWriteContract();
  const {
    writeContract: writeRequest,
    data: requestTxHash,
    isPending: isRequesting,
    error: requestError,
  } = useWriteContract();
  const {
    writeContract: writeClaim,
    data: claimTxHash,
    isPending: isClaiming,
    error: claimError,
  } = useWriteContract();

  // Wait for transaction receipts
  const { isSuccess: approveConfirmed } = useWaitForTransactionReceipt({
    hash: approveTxHash,
  });
  const { isSuccess: requestConfirmed, data: requestReceipt } =
    useWaitForTransactionReceipt({ hash: requestTxHash });
  const { isSuccess: claimConfirmed, data: claimReceipt } =
    useWaitForTransactionReceipt({ hash: claimTxHash });

  // Poll the on-chain request status while pending
  const { request: depositRequest } = useDepositRequest(state.requestId);

  // Parse amount to USDC units (6 decimals)
  const amountBigInt = state.amount ? parseUnits(state.amount, 6) : 0n;

  // Determine if approval is needed
  const needsApproval =
    allowance !== undefined &&
    amountBigInt > 0n &&
    (allowance as bigint) < amountBigInt;

  // --- Actions ---

  const setAmount = useCallback((amount: string) => {
    dispatch({ type: 'SET_AMOUNT', amount });
  }, []);

  const setBasket = useCallback((basket: `0x${string}`[]) => {
    dispatch({ type: 'SET_BASKET', basket });
  }, []);

  const approve = useCallback(async () => {
    if (!address) return;
    dispatch({ type: 'START_APPROVE' });
    await ensureChain();
    writeApprove({
      address: CONTRACTS.USDC.address,
      abi: CONTRACTS.USDC.abi,
      functionName: 'approve',
      args: [CONTRACTS.XYieldVault.address, amountBigInt],
      chainId: inkSepolia.id,
    });
  }, [address, amountBigInt, writeApprove, ensureChain]);

  const requestDeposit = useCallback(async () => {
    if (!address || state.basket.length === 0) return;
    await ensureChain();
    writeRequest({
      address: CONTRACTS.XYieldVault.address,
      abi: CONTRACTS.XYieldVault.abi,
      functionName: 'requestDepositWithBasket',
      args: [amountBigInt, address, state.basket],
      chainId: inkSepolia.id,
    });
  }, [address, amountBigInt, state.basket, writeRequest, ensureChain]);

  const claimDeposit = useCallback(async () => {
    if (state.requestId === undefined) return;
    dispatch({ type: 'START_CLAIM' });
    await ensureChain();
    writeClaim({
      address: CONTRACTS.XYieldVault.address,
      abi: CONTRACTS.XYieldVault.abi,
      functionName: 'claimDeposit',
      args: [state.requestId],
      chainId: inkSepolia.id,
    });
  }, [state.requestId, writeClaim, ensureChain]);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  // Start the deposit: approve first if needed, otherwise go straight to request
  const startDeposit = useCallback(async () => {
    if (needsApproval) {
      await approve();
    } else {
      dispatch({ type: 'APPROVE_CONFIRMED' });
      await requestDeposit();
    }
  }, [needsApproval, approve, requestDeposit]);

  // --- Side effects: track tx lifecycle ---

  // Approve tx hash dispatched
  useEffect(() => {
    if (approveTxHash && state.step === 'approving') {
      dispatch({ type: 'APPROVE_SENT', txHash: approveTxHash });
    }
  }, [approveTxHash, state.step]);

  // Request tx hash dispatched
  useEffect(() => {
    if (requestTxHash && state.step === 'requesting') {
      dispatch({ type: 'REQUEST_SENT', txHash: requestTxHash });
    }
  }, [requestTxHash, state.step]);

  // Claim tx hash dispatched
  useEffect(() => {
    if (claimTxHash && state.step === 'claiming') {
      dispatch({ type: 'CLAIM_SENT', txHash: claimTxHash });
    }
  }, [claimTxHash, state.step]);

  // Approve confirmed -> auto-fire the deposit request
  useEffect(() => {
    if (approveConfirmed && state.step === 'approving') {
      dispatch({ type: 'APPROVE_CONFIRMED' });
      requestDeposit();
    }
  }, [approveConfirmed, state.step, requestDeposit]);

  // Request confirmed -> extract requestId from DepositRequested event log
  // then trigger the operator API to fulfill the deposit
  useEffect(() => {
    if (requestConfirmed && requestReceipt && state.step === 'requesting') {
      let requestId = 0n;
      for (const log of requestReceipt.logs) {
        try {
          const decoded = decodeEventLog({
            abi: CONTRACTS.XYieldVault.abi,
            data: log.data,
            topics: log.topics,
          });
          if (
            decoded.eventName === 'DepositRequested' &&
            'requestId' in decoded.args
          ) {
            requestId = decoded.args.requestId as bigint;
            break;
          }
        } catch {
          // Not a matching event, skip
        }
      }
      dispatch({ type: 'REQUEST_CONFIRMED', requestId });

      // Trigger operator auto-fulfill
      fetch('/api/operator/fulfill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: Number(requestId),
          basket: state.basket,
        }),
      }).catch((err) => console.error('Operator fulfill failed:', err));
    }
  }, [requestConfirmed, requestReceipt, state.step, state.basket]);

  // Claim confirmed -> extract noteTokenId from DepositClaimed event log
  useEffect(() => {
    if (claimConfirmed && claimReceipt && state.step === 'claiming') {
      let noteTokenId = 0n;
      for (const log of claimReceipt.logs) {
        try {
          const decoded = decodeEventLog({
            abi: CONTRACTS.XYieldVault.abi,
            data: log.data,
            topics: log.topics,
          });
          if (
            decoded.eventName === 'DepositClaimed' &&
            'tokenId' in decoded.args
          ) {
            noteTokenId = decoded.args.tokenId as bigint;
            break;
          }
        } catch {
          // Not a matching event, skip
        }
      }
      dispatch({ type: 'CLAIM_CONFIRMED', noteTokenId });
    }
  }, [claimConfirmed, claimReceipt, state.step]);

  // Poll on-chain request status: transition to ready or expired
  useEffect(() => {
    if (!depositRequest || state.step !== 'pending') return;

    if (depositRequest.status === RequestStatus.ReadyToClaim) {
      dispatch({ type: 'DEPOSIT_READY' });
    }

    // Check if claim deadline has passed (24h from requestedAt)
    if (depositRequest.status === RequestStatus.Pending) {
      const now = BigInt(Math.floor(Date.now() / 1_000));
      const deadline = depositRequest.requestedAt + 86_400n; // 24 hours
      if (now > deadline) {
        dispatch({ type: 'EXPIRED' });
      }
    }
  }, [depositRequest, state.step]);

  // Handle write errors from any of the three contract calls
  useEffect(() => {
    const error = approveError || requestError || claimError;
    if (error) {
      const message =
        error instanceof Error ? error.message : 'Transaction failed';
      dispatch({ type: 'ERROR', error: message });
    }
  }, [approveError, requestError, claimError]);

  return {
    state,
    amountBigInt,
    needsApproval,
    isApproving,
    isRequesting,
    isClaiming,
    depositRequest,
    setAmount,
    setBasket,
    startDeposit,
    approve,
    requestDeposit,
    claimDeposit,
    reset,
  };
}
