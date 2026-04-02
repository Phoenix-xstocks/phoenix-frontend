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

  // Fire onClaimed once tx is confirmed
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
    <div className="rounded-2xl border border-[#40a040]/30 bg-[#40a040]/5 p-6">
      <p className="text-sm text-[#40a040] mb-4 tracking-wide uppercase font-medium">
        Ready to Claim
      </p>

      <div className="space-y-3">
        {claimable.map((deposit) => {
          const deadlineTs =
            Number(deposit.readyAt) +
            PROTOCOL_CONSTANTS.CLAIM_DEADLINE_HOURS * 3600;

          return (
            <div
              key={deposit.requestId.toString()}
              className="flex items-center justify-between gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02]"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-mono tabular-nums">
                  {formatUSDC(deposit.amount)} USDC
                </p>
                <div className="flex items-center gap-2 mt-1 text-xs text-white/30">
                  <span>Request #{deposit.requestId.toString()}</span>
                  <span className="w-px h-3 bg-white/10" />
                  <span>
                    Deadline: <CountdownTimer targetTimestamp={deadlineTs} />
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleClaim(deposit)}
                disabled={isClaiming || claimConfirmed}
                className="px-5 py-2.5 rounded-lg bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors disabled:bg-white/20 disabled:text-white/40 disabled:cursor-not-allowed"
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
