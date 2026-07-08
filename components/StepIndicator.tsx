interface StepIndicatorProps {
  currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = [
    { label: '上传户型图', step: 1 },
    { label: '填写需求', step: 2 },
    { label: '分析中', step: 3 },
    { label: '结果', step: 4 },
  ];

  return (
    <div className="flex items-center justify-center gap-8">
      {steps.map(({ label, step }, index) => (
        <div key={step} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                step <= currentStep
                  ? step === currentStep
                    ? 'bg-accent text-white'
                    : 'bg-accent/20 text-accent'
                  : 'bg-border text-muted'
              }`}
            >
              {step}
            </div>
            <span
              className={`mt-2 text-sm ${
                step === currentStep ? 'text-foreground font-medium' : 'text-muted'
              }`}
            >
              {label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className="w-16 h-px bg-border mx-4" />
          )}
        </div>
      ))}
    </div>
  );
}