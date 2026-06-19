import type { WizardFormData } from '../OnboardingWizard'

interface Props {
  data: WizardFormData
  onChange: <K extends keyof WizardFormData>(key: K, value: WizardFormData[K]) => void
}

function Toggle({ checked, onChange, label }: {
  checked: boolean; onChange: (v: boolean) => void; label: string
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <div
        onClick={() => onChange(!checked)}
        className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 ${
          checked ? 'bg-[#2E4A6B]' : 'bg-[#C8D8EC]'
        }`}
      >
        <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${
          checked ? 'translate-x-4' : 'translate-x-0'
        }`} />
      </div>
      <span className="text-sm text-[#1E3249]">{label}</span>
    </label>
  )
}

function Chip({ label, active, onClick }: {
  label: string; active: boolean; onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-all ${
        active
          ? 'bg-[#2E4A6B] text-white border-[#2E4A6B]'
          : 'bg-white text-[#4E779F] border-[#C8D8EC] hover:border-[#2E4A6B]/50'
      }`}
    >
      {label}
    </button>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h3 className="text-sm font-semibold text-[#2E4A6B] mb-3">{title}</h3>
      {children}
    </div>
  )
}

export default function StepSitterDetails({ data, onChange }: Props) {
  return (
    <div>
      <h2 className="text-xl font-bold text-[#1E3249] mb-6">Deine Sitter-Angaben</h2>

      <Section title="Erfahrung">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <label className="text-sm text-[#1E3249] min-w-max">Erfahrung in Jahren:</label>
            <input
              type="number"
              min={0}
              max={50}
              value={data.erfahrung_jahre}
              onChange={(e) => onChange('erfahrung_jahre', Number(e.target.value))}
              className="w-20 border border-[#C8D8EC] rounded-xl px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-[#2E4A6B]/30"
            />
          </div>
          <Toggle checked={data.hat_eigene_tiere} onChange={(v) => onChange('hat_eigene_tiere', v)} label="Habe eigene Tiere" />
          <Toggle checked={data.hat_garten} onChange={(v) => onChange('hat_garten', v)} label="Habe einen Garten" />
          <Toggle checked={data.kann_medikamente} onChange={(v) => onChange('kann_medikamente', v)} label="Kann Medikamente verabreichen" />
        </div>
      </Section>

      <Section title="Welche Tiere betreue ich?">
        <div className="flex flex-wrap gap-2">
          <Chip label="🐕 Hunde" active={data.betreut_hunde} onClick={() => onChange('betreut_hunde', !data.betreut_hunde)} />
          <Chip label="🐈 Katzen" active={data.betreut_katzen} onClick={() => onChange('betreut_katzen', !data.betreut_katzen)} />
          <Chip label="🐹 Kleintiere" active={data.betreut_kleintiere} onClick={() => onChange('betreut_kleintiere', !data.betreut_kleintiere)} />
        </div>
      </Section>

      <Section title="Welche Leistungen biete ich?">
        <div className="flex flex-wrap gap-2">
          <Chip label="🦮 Gassi" active={data.bietet_gassi} onClick={() => onChange('bietet_gassi', !data.bietet_gassi)} />
          <Chip label="🍖 Füttern" active={data.bietet_fuettern} onClick={() => onChange('bietet_fuettern', !data.bietet_fuettern)} />
          <Chip label="☀️ Tagesbetreuung" active={data.bietet_tagesbetreuung} onClick={() => onChange('bietet_tagesbetreuung', !data.bietet_tagesbetreuung)} />
          <Chip label="🌙 Übernachtung" active={data.bietet_uebernachtung} onClick={() => onChange('bietet_uebernachtung', !data.bietet_uebernachtung)} />
        </div>
      </Section>

      <Section title="Wie weit darfst Du fahren?">
        <input
          type="range"
          min={5}
          max={50}
          step={5}
          value={data.radius_km}
          onChange={(e) => onChange('radius_km', Number(e.target.value))}
          className="w-full accent-[#2E4A6B]"
        />
        <p className="text-sm text-[#2E4A6B] font-medium mt-1">{data.radius_km} km Umkreis{data.plz ? ` um ${data.plz}` : ''}</p>
        <p className="text-xs text-[#7A9DBF] mt-0.5">
          Tierhalter in diesem Radius sehen Dich bevorzugt bei Gesuchen.
        </p>
      </Section>

      {/* Notfall-Verfügbarkeit */}
      <div className="bg-[#FEF3E2] rounded-xl p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={data.notfall_verfuegbar}
            onChange={(e) => onChange('notfall_verfuegbar', e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-[#E07B30] flex-shrink-0"
          />
          <div>
            <span className="text-sm font-medium text-[#b45309]">
              Ich bin für Notfälle gerne direkt zu kontaktieren
            </span>
            <p className="text-xs text-[#b45309]/80 mt-0.5">
              z.B. wenn ein Tierhalter plötzlich ins Krankenhaus muss und kurzfristig Hilfe braucht.
            </p>
          </div>
        </label>

        {data.notfall_verfuegbar && (
          <div className="mt-4 flex flex-col gap-3 pl-7">
            <div>
              <label className="block text-xs font-medium text-[#b45309] mb-1">
                Notfall-Telefonnummer <span className="text-[#b45309]/60 font-normal">(für SMS/WhatsApp)</span>
              </label>
              <input
                type="tel"
                value={data.notfall_telefon}
                onChange={(e) => onChange('notfall_telefon', e.target.value)}
                placeholder="+49 …"
                className="w-full border border-[#F4A261] rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#E07B30]/30 bg-white"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={data.notfall_per_email}
                  onChange={(e) => onChange('notfall_per_email', e.target.checked)}
                  className="w-4 h-4 accent-[#E07B30]"
                />
                <span className="text-xs text-[#b45309]">Per E-Mail benachrichtigen</span>
              </label>
              <label className="flex items-center gap-2 opacity-50" title="Wird in Kürze freigeschaltet">
                <input type="checkbox" disabled className="w-4 h-4" />
                <span className="text-xs text-[#b45309]">Per SMS benachrichtigen <span className="italic">(Bald verfügbar)</span></span>
              </label>
              <label className="flex items-center gap-2 opacity-50" title="Wird in Kürze freigeschaltet">
                <input type="checkbox" disabled className="w-4 h-4" />
                <span className="text-xs text-[#b45309]">Per WhatsApp benachrichtigen <span className="italic">(Bald verfügbar)</span></span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
