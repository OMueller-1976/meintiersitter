interface Props {
  steps: string[]
  currentStep: number
  labels: Record<string, string>
}

export default function WizardProgress({ steps, currentStep, labels }: Props) {
  const label = (s: string) => labels[s] ?? s
  return (
    <nav aria-label="Fortschritt der Registrierung" className="mb-6">
      <ol className="flex items-start justify-between mb-3">
        {steps.map((step, i) => (
          <li
            key={`${step}-${i}`}
            aria-current={i === currentStep ? 'step' : undefined}
            className="flex items-center flex-1 last:flex-none"
          >
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 transition-all ${
                  i < currentStep
                    ? 'bg-[#2E4A6B] text-white'
                    : i === currentStep
                    ? 'bg-[#2E4A6B] text-white ring-4 ring-[#DDEAF4]'
                    : 'bg-[#EEF2F8] text-[#4E779F]'
                }`}
              >
                {i < currentStep ? '✓' : i + 1}
                <span className="sr-only">
                  {i < currentStep ? ' (erledigt) ' : i === currentStep ? ' (aktuell) ' : ' '}
                  {label(step)}
                </span>
              </div>
            </div>
            {i < steps.length - 1 && (
              <div
                aria-hidden="true"
                className={`h-0.5 flex-1 mx-1 mt-4 transition-colors ${
                  i < currentStep ? 'bg-[#2E4A6B]' : 'bg-[#EEF2F8]'
                }`}
              />
            )}
          </li>
        ))}
      </ol>
      <p className="text-center text-sm font-medium text-[#2E4A6B]" aria-live="polite">
        Schritt {currentStep + 1} von {steps.length}: {label(steps[currentStep])}
      </p>
    </nav>
  )
}
