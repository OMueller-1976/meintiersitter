import Link from 'next/link'
import type { WizardFormData, WizardErrors } from '../OnboardingWizard'

interface Props {
  data: WizardFormData
  onChange: <K extends keyof WizardFormData>(key: K, value: WizardFormData[K]) => void
  errors: WizardErrors
}

const ROLLE_LABEL: Record<string, string> = {
  tierhalter: '🐾 Tierhalter',
  sitter: '🤝 Sitter',
  beide: '⭐ Tierhalter & Sitter',
}

const LEISTUNGS_LABEL: Record<string, string> = {
  gassi: '🦮 Gassi',
  fuettern: '🍖 Füttern',
  tagesbetreuung: '☀️ Tagesbetreuung',
  uebernachtung: '🌙 Übernachtung',
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 text-sm">
      <span className="text-[#7A9DBF] min-w-[100px] flex-shrink-0">{label}</span>
      <span className="text-[#1E3249] font-medium">{value}</span>
    </div>
  )
}

export default function StepZusammenfassung({ data, onChange, errors }: Props) {
  const isSitter = data.rolle === 'sitter' || data.rolle === 'beide'

  const leistungen = [
    data.bietet_gassi && 'gassi',
    data.bietet_fuettern && 'fuettern',
    data.bietet_tagesbetreuung && 'tagesbetreuung',
    data.bietet_uebernachtung && 'uebernachtung',
  ].filter(Boolean) as string[]

  return (
    <div>
      <h2 className="text-xl font-bold text-[#1E3249] mb-1">Fast geschafft!</h2>
      <p className="text-sm text-[#4E779F] mb-5">Überprüfe Deine Angaben und akzeptiere die AGB.</p>

      <div className="bg-[#F7FAFC] rounded-2xl border border-[#C8D8EC] p-5 mb-5 flex flex-col gap-2.5">
        <Row label="Name" value={data.full_name || '—'} />
        <Row label="E-Mail" value={data.email || '—'} />
        <Row label="Rolle" value={data.rolle ? ROLLE_LABEL[data.rolle] : '—'} />
        <Row label="Ort" value={[data.plz, data.ort].filter(Boolean).join(' ') || '—'} />
        {data.ortschaft && <Row label="Ortschaft" value={data.ortschaft} />}
        {data.phone && <Row label="Telefon" value={data.phone} />}

        {isSitter && (
          <>
            <div className="border-t border-[#C8D8EC] my-1" />
            {data.radius_km > 0 && (
              <Row label="Radius" value={`${data.radius_km} km`} />
            )}
            {leistungen.length > 0 && (
              <div className="flex gap-2 text-sm">
                <span className="text-[#7A9DBF] min-w-[100px] flex-shrink-0">Leistungen</span>
                <span className="text-[#1E3249] font-medium">
                  {leistungen.map(l => LEISTUNGS_LABEL[l]).join(', ')}
                </span>
              </div>
            )}
            {data.hat_garten && <Row label="Extras" value="🌿 Garten" />}
            {data.notfall_verfuegbar && <Row label="Notfall" value="✓ Notfall-Kontakt aktiv" />}
          </>
        )}
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={data.agb_akzeptiert}
          onChange={(e) => onChange('agb_akzeptiert', e.target.checked)}
          className="mt-0.5 w-4 h-4 accent-[#2E4A6B] flex-shrink-0"
        />
        <span className="text-sm text-[#4E779F]">
          Ich akzeptiere die{' '}
          <Link href="/agb" target="_blank" className="text-[#2E4A6B] hover:underline">
            AGB
          </Link>{' '}
          und die{' '}
          <Link href="/datenschutz" target="_blank" className="text-[#2E4A6B] hover:underline">
            Datenschutzerklärung
          </Link>
          .
        </span>
      </label>
      {errors.agb_akzeptiert && (
        <p className="text-red-500 text-xs mt-1 ml-7">{errors.agb_akzeptiert}</p>
      )}
    </div>
  )
}
