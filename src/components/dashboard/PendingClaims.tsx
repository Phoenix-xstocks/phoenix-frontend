'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { toast } from 'sonner';
import { CONTRACTS } from '@/lib/contracts';
import { inkSepolia } from '@/lib/chains';
import { formatUSDC } from '@/lib/format';
import { useClaimableDeposits, type ClaimableDeposit } from '@/hooks/useClaimableDeposits';
import { useEnsureChain } from '@/hooks/useEnsureChain';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { PROTOCOL_CONSTANTS } from '@/lib/constants';

interface PendingClaimsProps {
  onClaimed?: (deposit: ClaimableDeposit) => void;
}

export function PendingClaims({ onClaimed }: PendingClaimsProps) {
  const { claimable, isLoading } = useClaimableDeposits();
  const { ensureChain } = useEnsureChain();
  const claimedDepositRef = useRef<ClaimableDeposit | null>(null);
  const {
    writeContract,
    data: claimTxHash,
    isPending: isClaiming,
  } = useWriteContract();

  const { isSuccess: claimConfirmed } = useWaitForTransactionReceipt({
    hash: claimTxHash,
  });

  useEffect(() => {
    if (claimConfirmed && claimedDepositRef.current && onClaimed) {
      onClaimed(claimedDepositRef.current);
      claimedDepositRef.current = null;
    }
  }, [claimConfirmed, onClaimed]);

  const handleClaim = useCallback(
    async (deposit: ClaimableDeposit) => {
      claimedDepositRef.current = deposit;
      await ensureChain();
      writeContract(
        {
          address: CONTRACTS.XYieldVault.address,
          abi: CONTRACTS.XYieldVault.abi,
          functionName: 'claimDeposit',
          args: [deposit.requestId],
          chainId: inkSepolia.id,
        },
        {
          onSuccess: () => toast.success('Claim submitted!'),
          onError: (err) =>
            toast.error(err instanceof Error ? err.message : 'Claim failed'),
        },
      );
    },
    [writeContract, ensureChain],
  );

  if (isLoading || claimable.length === 0) return null;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-1.5 rounded-full bg-[#40a040] animate-pulse" />
        <p className="text-xs uppercase tracking-[0.2em] text-[#40a040]/80 font-medium">
          Ready to Claim
        </p>
      </div>

      <div className="space-y-2">
        {claimable.map((deposit) => {
          const deadlineTs =
            Number(deposit.readyAt) +
            PROTOCOL_CONSTANTS.CLAIM_DEADLINE_HOURS * 3600;

          return (
            <div
              key={deposit.requestId.toString()}
              className="flex items-center justify-between gap-4 p-5 rounded-xl border border-[#40a040]/15 bg-[#40a040]/[0.03] hover:bg-[#40a040]/[0.05] transition-colors duration-300"
            >
              <div className="flex-1 min-w-0">
                <p className="text-lg font-light tabular-nums text-white">
                  {formatUSDC(deposit.amount)} USDC
                </p>
                <div className="flex items-center gap-2 mt-1.5 text-[11px] text-white/25">
                  <span>Request #{deposit.requestId.toString()}</span>
                  <span className="w-px h-2.5 bg-white/10" />
                  <span>
                    Deadline: <CountdownTimer targetTimestamp={deadlineTs} />
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleClaim(deposit)}
                disabled={isClaiming || claimConfirmed}
                className="px-6 py-2.5 rounded-full border border-white bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors disabled:bg-white/10 disabled:text-white/30 disabled:border-white/10 disabled:cursor-not-allowed"
              >
                {isClaiming ? 'Claiming...' : claimConfirmed ? 'Claimed!' : 'Claim Note'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
