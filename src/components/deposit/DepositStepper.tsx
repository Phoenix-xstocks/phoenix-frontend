'use client';

interface DepositStepperProps {
  currentStep: number;
  completedSteps: number[];
}

const steps = [
  { title: 'Approve USDC', subtitle: 'Allow vault to spend your USDC' },
  { title: 'Request Deposit', subtitle: 'Submit deposit with basket selection' },
  { title: 'Claim Note', subtitle: 'Claim your NoteToken after pricing' },
];

export function DepositStepper({ currentStep, completedSteps }: DepositStepperProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-0">
      {steps.map((step, index) => {
        const isCompleted = completedSteps.includes(index);
        const isActive = currentStep === index;

        return (
          <div key={index} className="flex items-center flex-1 w-full sm:w-auto">
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0 transition-all ${
                  isCompleted
                    ? 'bg-gain/20 text-gain'
                    : isActive
                      ? 'bg-white/10 text-white ring-2 ring-white/30 animate-pulse'
                      : 'bg-white/5 text-muted-foreground border border-white/10'
                }`}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>

              <div className="min-w-0">
                <div
                  className={`text-sm font-medium ${
                    isCompleted ? 'text-gain' : isActive ? 'text-white' : 'text-muted-foreground'
                  }`}
                >
                  {step.title}
                </div>
                <div className="text-xs text-muted-foreground truncate">{step.subtitle}</div>
              </div>
            </div>

            {index < steps.length - 1 && (
              <div
                className={`hidden sm:block flex-1 h-px mx-4 ${
                  completedSteps.includes(index) ? 'bg-gain/40' : 'bg-white/20'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
