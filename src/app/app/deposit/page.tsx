'use client';

import { useCallback } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { toast } from 'sonner';
import { PageContainer } from '@/components/layout/PageContainer';
import { HeroScene } from '@/components/hero-scene';
import { BasketSelector } from '@/components/deposit/BasketSelector';
import { AmountInput } from '@/components/deposit/AmountInput';
import { FeeBreakdown } from '@/components/deposit/FeeBreakdown';
import { EstimatedCoupon } from '@/components/deposit/EstimatedCoupon';
import { DepositStepper } from '@/components/deposit/DepositStepper';
import { DepositStatusTracker } from '@/components/deposit/DepositStatusTracker';
import { TransactionButton } from '@/components/ui/TransactionButton';
import { useDepositFlow } from '@/hooks/useDepositFlow';
import { useTokenBalance } from '@/hooks/useTokenBalance';
import { useMaxDeposit } from '@/hooks/useMaxDeposit';
import { CONTRACTS } from '@/lib/contracts';
import { inkSepolia } from '@/lib/chains';
import { PROTOCOL_CONSTANTS } from '@/lib/constants';
import { formatUSDC } from '@/lib/format';

export default function DepositPage() {
  const { address, isConnected } = useAccount();
  const { balance: usdcBalance } = useTokenBalance(CONTRACTS.USDC.address, address);
  const { maxDeposit } = useMaxDeposit(address);

  const {
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
    claimDeposit,
    reset,
  } = useDepositFlow();

  // Refund handler using the on-chain refundDeposit function
  const { writeContract: writeRefund, isPending: isRefunding } = useWriteContract();
  const handleRefund = useCallback(() => {
    if (state.requestId === undefined) return;
    writeRefund(
      {
        address: CONTRACTS.XYieldVault.address,
        abi: CONTRACTS.XYieldVault.abi,
        functionName: 'refundDeposit',
        args: [state.requestId],
        chainId: inkSepolia.id,
      },
      {
        onSuccess: () => {
          toast.success('Deposit refunded successfully');
          reset();
        },
        onError: (error) => {
          toast.error(error instanceof Error ? error.message : 'Refund failed');
        },
      },
    );
  }, [state.requestId, writeRefund, reset]);

  const isValidAmount =
    amountBigInt >= PROTOCOL_CONSTANTS.MIN_NOTE_SIZE &&
    amountBigInt <= PROTOCOL_CONSTANTS.MAX_NOTE_SIZE;
  const isValidBasket = state.basket.length > 0;
  const hasSufficientBalance = usdcBalance !== undefined && amountBigInt <= usdcBalance;
  const exceedsVaultCapacity = maxDeposit !== undefined && amountBigInt > 0n && amountBigInt > maxDeposit;
  const canDeposit = isConnected && isValidAmount && isValidBasket && hasSufficientBalance && !exceedsVaultCapacity;

  // Compute net amount after fees
  const totalFeeBps = PROTOCOL_CONSTANTS.EMBEDDED_FEE_BPS + PROTOCOL_CONSTANTS.ORIGINATION_FEE_BPS;
  const netAmount = amountBigInt > 0n ? amountBigInt - (amountBigInt * totalFeeBps) / 10_000n : 0n;

  // Determine current step for stepper
  const currentStep =
    state.step === 'configure' || state.step === 'approving' ? 0
    : state.step === 'requesting' || state.step === 'pending' ? 1
    : 2;
  const completedSteps =
    state.step === 'done' ? [0, 1, 2]
    : state.step === 'ready' || state.step === 'claiming' ? [0, 1]
    : state.step === 'pending' || state.step === 'requesting' ? [0]
    : state.step === 'approving' ? []
    : [];

  const content = state.step === 'configure' || state.step === 'error' ? (
    <div className="max-w-2xl mx-auto space-y-6">
      <BasketSelector
        selected={state.basket}
        onChange={(basket) => setBasket(basket as `0x${string}`[])}
      />

      <AmountInput
        value={state.amount}
        onChange={setAmount}
        balance={usdcBalance}
      />

      {amountBigInt > 0n && (
        <>
          <FeeBreakdown amount={amountBigInt} />
          <EstimatedCoupon netAmount={netAmount} />
        </>
      )}

      {exceedsVaultCapacity && maxDeposit !== undefined && (
        <div className="bg-loss/10 border border-loss/30 rounded-lg p-4 text-sm text-loss">
          Exceeds vault capacity. Maximum deposit: ${formatUSDC(maxDeposit)}
        </div>
      )}

      {state.error && (
        <div className="bg-loss/10 border border-loss/30 rounded-lg p-4 text-sm text-loss">
          {state.error}
        </div>
      )}

      {!isConnected ? (
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6 text-center text-muted-foreground">
          Connect your wallet to deposit
        </div>
      ) : (
        <TransactionButton
          label={needsApproval ? 'Approve & Deposit' : 'Deposit'}
          onClick={startDeposit}
          disabled={!canDeposit}
          isLoading={isApproving || isRequesting}
          className="w-full"
        />
      )}
    </div>
  ) : (
    <div className="max-w-2xl mx-auto space-y-6">
      <DepositStepper currentStep={currentStep} completedSteps={completedSteps} />

      {(state.step === 'approving' || state.step === 'requesting') && (
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-8 text-center">
          <div className="animate-pulse text-white text-lg mb-2">
            {state.step === 'approving' ? 'Approving USDC...' : 'Submitting deposit request...'}
          </div>
          <p className="text-sm text-muted-foreground">Please confirm the transaction in your wallet</p>
          {state.txHash && (
            <p className="text-xs text-muted-foreground mt-2 font-mono">
              Tx: {state.txHash.slice(0, 10)}...{state.txHash.slice(-8)}
            </p>
          )}
        </div>
      )}

      {(state.step === 'pending' || state.step === 'ready' || state.step === 'expired') && (
        <DepositStatusTracker
          requestId={state.requestId ?? 0n}
          amount={amountBigInt}
          basket={state.basket}
          requestedAt={depositRequest?.requestedAt && depositRequest.requestedAt > 0n
            ? Number(depositRequest.requestedAt)
            : Math.floor(Date.now() / 1000)}
          status={state.step as 'pending' | 'ready' | 'expired'}
          onClaim={claimDeposit}
          onRefund={handleRefund}
        />
      )}

      {state.step === 'claiming' && (
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-8 text-center">
          <div className="animate-pulse text-white text-lg mb-2">
            Claiming your NoteToken...
          </div>
          <p className="text-sm text-muted-foreground">Please confirm the transaction in your wallet</p>
        </div>
      )}

      {state.step === 'done' && (
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-8 text-center">
          <div className="text-gain text-2xl font-bold mb-2">Deposit Complete</div>
          <p className="text-muted-foreground mb-4">
            Your NoteToken has been minted. You can view it in My Notes.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/app/dashboard"
              className="px-6 py-3 bg-white text-black hover:bg-white/90 rounded-lg font-medium transition-colors"
            >
              View My Notes
            </a>
            <button
              onClick={reset}
              className="px-6 py-3 hover:bg-white/10 text-white rounded-lg font-medium transition-colors border border-white/20 backdrop-blur-sm"
            >
              New Deposit
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 -z-10">
        <HeroScene scrollProgress={0} centerMode />
      </div>
      <PageContainer title="Deposit" subtitle="Create a new autocall note with USDC">
        {content}
      </PageContainer>
    </>
  );
}
