'use client'

import type { WizardFormData } from '@/components/auth/OnboardingWizard'

interface Props {
  data: WizardFormData
  onChange: <K extends keyof WizardFormData>(key: K, value: WizardFormData[K]) => void
  onSkip: () => void
}

const TIER_CHIPS = [
  { key: 'betreut_hunde' as const, label: '🐶 Hunde' },
  { key: 'betreut_katzen' as const, label: '🐱 Katzen' },
  { key: 'betreut_kleintiere' as const, label: '🐹 Kleintiere' },
]

const LEISTUNGS_CHIPS = [
  { key: 'bietet_gassi' as const, label: '🦮 Gassi gehen' },
  { key: 'bietet_fuettern' as const, label: '🍖 Füttern' },
  { key: 'bietet_tagesbetreuung' as const, label: '☀️ Tagesbetreuung' },
  { key: 'bietet_uebernachtung' as const, label: '🌙 Übernachtung' },
]


function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-6 rounded-full transition-colors flex-shrink-0 ${
          checked ? 'bg-[#2E4A6B]' : 'bg-gray-200'
        }`}
        aria-checked={checked}
        role="switch"
      >
        <span
          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
            checked ? 'translate-x-4' : ''
          }`}
        />
      </button>
      <span className="text-sm text-[#1E3249]">{label}</span>
    </label>
  )
}

export default function StepSitterOnboarding({ data, onChange, onSkip }: Props) {
  return (
    <div>
      <div className="flex items-start justify-between mb-1">
        <h2 className="text-xl font-bold text-[#1E3249]">Dein Sitter-Profil</h2>
        <button
          type="button"
          onClick={onSkip}
          className="text-sm text-[#7A9DBF] hover:text-[#2E4A6B] transition-colors flex-shrink-0 mt-1"
        >
          Überspringen →
        </button>
      </div>
      <p className="text-sm text-[#4E779F] mb-6">
        Alle Angaben sind optional — Du kannst sie später im Profil ergänzen.
      </p>

      <div className="flex flex-col gap-5">

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-[#2E4A6B] mb-1.5">
            Kurze Vorstellung
          </label>
          <textarea
            value={data.bio}
            onChange={(e) => onChange('bio', e.target.value)}
            maxLength={300}
            rows={3}
            placeholder="Erzähl kurz etwas über Dich und Deine Erfahrung mit Tieren…"
            className="w-full border border-[#C8D8EC] rounded-xl px-3 py-2.5 text-sm text-[#1E3249] placeholder-[#B0C8E0] focus:outline-none focus:border-[#2E4A6B] resize-none"
          />
          <p className="text-xs text-[#B0C8E0] text-right mt-0.5">
            {data.bio.length}/300
          </p>
        </div>

        {/* Erfahrung Jahre */}
        <div>
          <label className="block text-sm font-medium text-[#2E4A6B] mb-1.5">
            Jahre Erfahrung mit Tieren
          </label>
          <input
            type="number"
            min={0}
            max={50}
            value={data.erfahrung_jahre}
            onChange={(e) => onChange('erfahrung_jahre', Math.min(50, Math.max(0, Number(e.target.value))))}
            className="w-24 border border-[#C8D8EC] rounded-xl px-3 py-2 text-sm text-[#1E3249] focus:outline-none focus:border-[#2E4A6B]"
          />
        </div>

        {/* Welche Tiere */}
        <div>
          <p className="text-sm font-medium text-[#2E4A6B] mb-2">Welche Tiere betreust Du?</p>
          <div className="flex flex-wrap gap-2">
            {TIER_CHIPS.map(({ key, label }) => (
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

        {/* Welche Leistungen */}
        <div>
          <p className="text-sm font-medium text-[#2E4A6B] mb-2">Welche Leistungen bietest Du?</p>
          <div className="flex flex-wrap gap-2">
            {LEISTUNGS_CHIPS.map(({ key, label }) => (
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

        {/* Radius */}
        <div>
          <p className="text-sm font-medium text-[#2E4A6B] mb-2">In welchem Umkreis?</p>
          <input
            type="range"
            min={5}
            max={50}
            step={5}
            value={data.radius_km ?? 10}
            onChange={(e) => onChange('radius_km', Number(e.target.value))}
            className="w-full accent-[#2E4A6B]"
          />
          <p className="text-sm text-center text-[#4E779F] mt-1">{data.radius_km ?? 10} km Umkreis</p>
        </div>

        {/* Toggles */}
        <div className="flex flex-col gap-3 pt-1">
          <Toggle
            checked={data.hat_eigene_tiere}
            onChange={(v) => onChange('hat_eigene_tiere', v)}
            label="Ich habe selbst Tiere"
          />
          {data.hat_eigene_tiere && (
            <textarea
              value={data.eigene_tiere_beschreibung}
              onChange={(e) => onChange('eigene_tiere_beschreibung', e.target.value)}
              placeholder="Welche Tiere? z.B. 1 Labrador, 2 Katzen"
              rows={2}
              className="w-full border border-[#C8D8EC] rounded-xl px-3 py-2 text-sm text-[#1E3249] placeholder-[#B0C8E0] focus:outline-none focus:border-[#2E4A6B] resize-none"
            />
          )}
          <Toggle
            checked={data.hat_garten}
            onChange={(v) => onChange('hat_garten', v)}
            label="Ich habe einen Garten"
          />
          <Toggle
            checked={data.kann_medikamente}
            onChange={(v) => onChange('kann_medikamente', v)}
            label="Ich kann Medikamente verabreichen"
          />
        </div>

        {/* Notfall-Erreichbarkeit */}
        <div className="flex flex-col gap-3 pt-1">
          <p className="text-sm font-medium text-[#2E4A6B]">Notfall-Erreichbarkeit <span className="font-normal text-[#B0C8E0]">(optional)</span></p>
          <Toggle
            checked={data.notfall_verfuegbar}
            onChange={(v) => onChange('notfall_verfuegbar', v)}
            label="Ich bin auch für Notfälle verfügbar"
          />
          {data.notfall_verfuegbar && (
            <div className="flex flex-col gap-3 pl-1">
              <input
                type="tel"
                value={data.notfall_telefon}
                onChange={(e) => onChange('notfall_telefon', e.target.value)}
                placeholder="Notfall-Telefonnummer"
                className="w-full border border-[#C8D8EC] rounded-xl px-3 py-2 text-sm text-[#1E3249] placeholder-[#B0C8E0] focus:outline-none focus:border-[#2E4A6B]"
              />
              <p className="text-xs text-[#4E779F]">Wie darf man Dich kontaktieren?</p>
              <Toggle checked={data.notfall_per_email} onChange={(v) => onChange('notfall_per_email', v)} label="Per E-Mail" />
              <Toggle checked={data.notfall_per_sms} onChange={(v) => onChange('notfall_per_sms', v)} label="Per SMS" />
              <Toggle checked={data.notfall_per_whatsapp} onChange={(v) => onChange('notfall_per_whatsapp', v)} label="Per WhatsApp" />
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
