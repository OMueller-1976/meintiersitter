import type { WizardRole } from '../OnboardingWizard'

interface Props {
  value: WizardRole | null
  onChange: (role: WizardRole) => void
}

const ROLLEN = [
  {
    id: 'tierhalter' as WizardRole,
    emoji: '🐾',
    title: 'Ich suche einen Sitter',
    sub: 'Für mein Tier · Kostenlos',
  },
  {
    id: 'sitter' as WizardRole,
    emoji: '🤝',
    title: 'Ich biete Sitter-Dienste an',
    sub: 'Kostenlos · Hilfe für Nachbarn',
  },
  {
    id: 'beide' as WizardRole,
    emoji: '⭐',
    title: 'Beides — ich suche UND biete an',
    sub: 'Volle Flexibilität · Kostenlos',
  },
]

export default function StepRolle({ value, onChange }: Props) {
  return (
    <div>
      <h2 className="text-xl font-bold text-[#1E3249] mb-1">Wie möchtest Du mitmachen?</h2>
      <p className="text-sm text-[#4E779F] mb-6">
        Du kannst später jederzeit beide Rollen nutzen.
      </p>

      <div className="flex flex-col gap-3">
        {ROLLEN.map((r) => {
          const isSelected = value === r.id
          return (
            <button
              key={r.id}
              onClick={() => onChange(r.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                isSelected
                  ? 'border-[#2E4A6B] bg-[#EEF2F8]'
                  : 'border-[#C8D8EC] hover:border-[#2E4A6B]/50 hover:bg-[#F7FAFC]'
              }`}
            >
              <span className="text-3xl flex-shrink-0">{r.emoji}</span>
              <div>
                <div className={`font-semibold text-sm ${isSelected ? 'text-[#2E4A6B]' : 'text-[#1E3249]'}`}>
                  {r.title}
                </div>
                <div className="text-xs text-[#7A9DBF] mt-0.5">{r.sub}</div>
              </div>
              {isSelected && (
                <span className="ml-auto text-[#2E4A6B] font-bold flex-shrink-0">✓</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
