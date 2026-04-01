'use client';

import { useAccount } from 'wagmi';
import { parseUnits } from 'viem';
import { PageContainer } from '@/components/layout/PageContainer';
import { BasketSelector } from '@/components/deposit/BasketSelector';
import { AmountInput } from '@/components/deposit/AmountInput';
import { FeeBreakdown } from '@/components/deposit/FeeBreakdown';
import { EstimatedCoupon } from '@/components/deposit/EstimatedCoupon';
import { DepositStepper } from '@/components/deposit/DepositStepper';
import { DepositStatusTracker } from '@/components/deposit/DepositStatusTracker';
import { TransactionButton } from '@/components/ui/TransactionButton';
import { useDepositFlow } from '@/hooks/useDepositFlow';
import { useTokenBalance } from '@/hooks/useTokenBalance';
import { CONTRACTS } from '@/lib/contracts';
import { PROTOCOL_CONSTANTS } from '@/lib/constants';

export default function DepositPage() {
  const { address, isConnected } = useAccount();
  const { balance: usdcBalance } = useTokenBalance(CONTRACTS.USDC.address, address);

  const {
    state,
    amountBigInt,
    needsApproval,
    isApproving,
    isRequesting,
    isClaiming,
    setAmount,
    setBasket,
    startDeposit,
    claimDeposit,
    reset,
  } = useDepositFlow();

  const isValidAmount =
    amountBigInt >= PROTOCOL_CONSTANTS.MIN_NOTE_SIZE &&
    amountBigInt <= PROTOCOL_CONSTANTS.MAX_NOTE_SIZE;
  const isValidBasket = state.basket.length > 0;
  const canDeposit = isConnected && isValidAmount && isValidBasket;

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

  // Configure view
  if (state.step === 'configure' || state.step === 'error') {
    return (
      <PageContainer title="Deposit" subtitle="Create a new autocall note with USDC">
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

          {state.error && (
            <div className="bg-loss/10 border border-loss/30 rounded-lg p-4 text-sm text-loss">
              {state.error}
            </div>
          )}

          {!isConnected ? (
            <div className="bg-surface rounded-xl border border-border p-6 text-center text-muted">
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
      </PageContainer>
    );
  }

  // Active flow view (approving, requesting, pending, ready, claiming, done)
  return (
    <PageContainer title="Deposit" subtitle="Create a new autocall note with USDC">
      <div className="max-w-2xl mx-auto space-y-6">
        <DepositStepper currentStep={currentStep} completedSteps={completedSteps} />

        {(state.step === 'approving' || state.step === 'requesting') && (
          <div className="bg-surface rounded-xl border border-border p-8 text-center">
            <div className="animate-pulse text-accent text-lg mb-2">
              {state.step === 'approving' ? 'Approving USDC...' : 'Submitting deposit request...'}
            </div>
            <p className="text-sm text-muted">Please confirm the transaction in your wallet</p>
            {state.txHash && (
              <p className="text-xs text-muted mt-2 font-mono">
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
            requestedAt={Math.floor(Date.now() / 1000)}
            status={state.step as 'pending' | 'ready' | 'expired'}
            onClaim={claimDeposit}
            onRefund={() => {/* TODO: implement refund */}}
          />
        )}

        {state.step === 'claiming' && (
          <div className="bg-surface rounded-xl border border-border p-8 text-center">
            <div className="animate-pulse text-accent text-lg mb-2">
              Claiming your NoteToken...
            </div>
            <p className="text-sm text-muted">Please confirm the transaction in your wallet</p>
          </div>
        )}

        {state.step === 'done' && (
          <div className="bg-surface rounded-xl border border-accent/30 p-8 text-center">
            <div className="text-gain text-2xl font-bold mb-2">Deposit Complete</div>
            <p className="text-muted mb-4">
              Your NoteToken has been minted. You can view it in My Notes.
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="/notes"
                className="px-6 py-3 bg-accent hover:bg-accent-dim text-white rounded-lg font-medium transition-colors"
              >
                View My Notes
              </a>
              <button
                onClick={reset}
                className="px-6 py-3 bg-surface-2 hover:bg-border text-white rounded-lg font-medium transition-colors border border-border"
              >
                New Deposit
              </button>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
