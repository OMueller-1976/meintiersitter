'use client'

import type { WizardFormData } from '@/components/auth/OnboardingWizard'

interface Props {
  data: WizardFormData
  onChange: <K extends keyof WizardFormData>(key: K, value: WizardFormData[K]) => void
  onSkip: () => void
}

const TIERART_CHIPS: { key: NonNullable<WizardFormData['tierart']>; label: string }[] = [
  { key: 'hund', label: '🐶 Hund' },
  { key: 'katze', label: '🐱 Katze' },
  { key: 'vogel', label: '🐦 Vogel' },
  { key: 'kleintier', label: '🐹 Kleintier' },
  { key: 'sonstiges', label: '🐾 Sonstiges' },
]

const VERTRAGLICH_CHIPS: { key: 'vertraeglich_hunde' | 'vertraeglich_katzen' | 'vertraeglich_kinder'; label: string }[] = [
  { key: 'vertraeglich_hunde', label: '🐶 Hunde' },
  { key: 'vertraeglich_katzen', label: '🐱 Katzen' },
  { key: 'vertraeglich_kinder', label: '👶 Kinder' },
]

export default function StepTierOnboarding({ data, onChange, onSkip }: Props) {
  return (
    <div>
      <div className="flex items-start justify-between mb-1">
        <h2 className="text-xl font-bold text-[#1E3249]">Dein Tier</h2>
        <button
          type="button"
          onClick={onSkip}
          className="text-sm text-[#7A9DBF] hover:text-[#2E4A6B] transition-colors flex-shrink-0 mt-1"
        >
          Überspringen →
        </button>
      </div>
      <p className="text-sm text-[#4E779F] mb-6">
        Alle Angaben sind optional — Du kannst sie später in &quot;Meine Tiere&quot; ergänzen.
      </p>

      <div className="flex flex-col gap-5">

        {/* Tier-Name */}
        <div>
          <label className="block text-sm font-medium text-[#2E4A6B] mb-1.5">
            Wie heißt Dein Tier?
          </label>
          <input
            type="text"
            value={data.tier_name}
            onChange={(e) => onChange('tier_name', e.target.value)}
            placeholder="z.B. Bello, Mimi, Tweety…"
            className="w-full border border-[#C8D8EC] rounded-xl px-3 py-2.5 text-sm text-[#1E3249] placeholder-[#B0C8E0] focus:outline-none focus:border-[#2E4A6B]"
          />
        </div>

        {/* Tierart */}
        <div>
          <p className="text-sm font-medium text-[#2E4A6B] mb-2">Tierart</p>
          <div className="flex flex-wrap gap-2">
            {TIERART_CHIPS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => onChange('tierart', data.tierart === key ? null : key)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                  data.tierart === key
                    ? 'bg-[#2E4A6B] text-white border-[#2E4A6B]'
                    : 'bg-white text-[#4E779F] border-[#C8D8EC] hover:border-[#2E4A6B]/50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Rasse */}
        <div>
          <label className="block text-sm font-medium text-[#2E4A6B] mb-1.5">
            Rasse <span className="font-normal text-[#B0C8E0]">(optional)</span>
          </label>
          <input
            type="text"
            value={data.rasse}
            onChange={(e) => onChange('rasse', e.target.value)}
            placeholder="z.B. Labrador, Perser, Wellensittich…"
            className="w-full border border-[#C8D8EC] rounded-xl px-3 py-2.5 text-sm text-[#1E3249] placeholder-[#B0C8E0] focus:outline-none focus:border-[#2E4A6B]"
          />
        </div>

        {/* Alter */}
        <div>
          <label className="block text-sm font-medium text-[#2E4A6B] mb-1.5">
            Alter (Jahre)
          </label>
          <input
            type="number"
            min={0}
            max={30}
            value={data.alter_jahre}
            onChange={(e) => onChange('alter_jahre', Math.min(30, Math.max(0, Number(e.target.value))))}
            className="w-24 border border-[#C8D8EC] rounded-xl px-3 py-2 text-sm text-[#1E3249] focus:outline-none focus:border-[#2E4A6B]"
          />
        </div>

        {/* Verträglichkeit */}
        <div>
          <p className="text-sm font-medium text-[#2E4A6B] mb-2">Verträglich mit…</p>
          <div className="flex flex-wrap gap-2">
            {VERTRAGLICH_CHIPS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => onChange(key, !data[key])}
                className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                  data[key]
                    ? 'bg-[#2E4A6B] text-white border-[#2E4A6B]'
                    : 'bg-white text-[#4E779F] border-[#C8D8EC] hover:border-[#2E4A6B]/50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Besonderheiten */}
        <div>
          <label className="block text-sm font-medium text-[#2E4A6B] mb-1.5">
            Besonderheiten
          </label>
          <textarea
            value={data.besonderheiten}
            onChange={(e) => onChange('besonderheiten', e.target.value)}
            maxLength={300}
            rows={3}
            placeholder="Medikamente, Allergien, Gewohnheiten — was ein Sitter wissen sollte…"
            className="w-full border border-[#C8D8EC] rounded-xl px-3 py-2.5 text-sm text-[#1E3249] placeholder-[#B0C8E0] focus:outline-none focus:border-[#2E4A6B] resize-none"
          />
          <p className="text-xs text-[#B0C8E0] text-right mt-0.5">
            {data.besonderheiten.length}/300
          </p>
        </div>

        {/* Hinweistext */}
        <p className="text-xs text-[#B0C8E0] leading-relaxed">
          Fotos und weitere Details kannst Du nach der Bestätigung in &quot;Meine Tiere&quot; ergänzen.
        </p>

      </div>
    </div>
  )
}
