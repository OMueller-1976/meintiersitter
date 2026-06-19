interface Props {
  steps: string[]
  currentStep: number
  labels: Record<string, string>
}

export default function WizardProgress({ steps, currentStep, labels }: Props) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 transition-all ${
                i < currentStep
                  ? 'bg-[#2E4A6B] text-white'
                  : i === currentStep
                  ? 'bg-[#2E4A6B] text-white ring-4 ring-[#DDEAF4]'
                  : 'bg-[#EEF2F8] text-[#7A9DBF]'
              }`}
            >
              {i < currentStep ? '✓' : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-1 transition-colors ${
                  i < currentStep ? 'bg-[#2E4A6B]' : 'bg-[#EEF2F8]'
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-[#4E779F]">
        {labels[steps[currentStep]] ?? steps[currentStep]}
      </p>
    </div>
  )
}
