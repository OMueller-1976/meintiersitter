import { useEffect, useState } from 'react'
import type { WizardFormData, WizardErrors } from '../OnboardingWizard'
import { REGIONS, isRegionSlug } from '@/lib/regions'
import type { RegionSlug } from '@/lib/regions'

interface Props {
  data: WizardFormData
  onChange: <K extends keyof WizardFormData>(key: K, value: WizardFormData[K]) => void
  errors: WizardErrors
  onBlurField: (key: keyof WizardFormData) => void
  regionSlug: RegionSlug | null
  onRegionChange: (slug: RegionSlug | null) => void
}

export default function StepAdresse({ data, onChange, onBlurField, errors, regionSlug, onRegionChange }: Props) {
  const inputClass = (hasError: boolean) =>
    `w-full border rounded-xl px-3 py-2.5 text-base sm:text-sm outline-none focus:ring-2 focus:ring-[#2E4A6B]/40 ${
      hasError ? 'border-red-500 bg-red-50' : 'border-[#C8D8EC]'
    }`

  // Region zur PLZ vorschlagen (nur wenn eindeutig). Übernimmt automatisch, solange noch keine Region gewählt ist.
  const [vorschlag, setVorschlag] = useState<RegionSlug | null>(null)
  useEffect(() => {
    setVorschlag(null)
    if (!/^\d{5}$/.test(data.plz)) return
    let abgebrochen = false
    fetch(`/api/plz-region?plz=${data.plz}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((antwort) => {
        if (abgebrochen || !antwort || antwort.status !== 'ok' || !isRegionSlug(antwort.region)) return
        if (!regionSlug) onRegionChange(antwort.region)
        else if (antwort.region !== regionSlug) setVorschlag(antwort.region)
      })
      .catch(() => {})
    return () => { abgebrochen = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.plz])

  return (
    <div>
      <h2 className="text-xl font-bold text-[#1E3249] mb-1">Wo bist Du zu Hause?</h2>
      <p className="text-sm text-[#4E779F] mb-6">
        Damit wir Dich mit der Community in Deiner Nähe verbinden können.
      </p>

      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="reg-region" className="block text-sm font-medium text-[#1E3249] mb-1">
            Landkreis / Region <span className="text-red-600" aria-hidden="true">*</span>
          </label>
          <select id="reg-region"
            value={regionSlug ?? ''}
            onChange={(e) => onRegionChange(isRegionSlug(e.target.value) ? e.target.value : null)}
            className={inputClass(!!errors.region)}
              aria-invalid={!!errors.region}
              aria-describedby={errors.region ? "reg-region-error" : undefined}
          >
            <option value="">Bitte wählen…</option>
            {Object.entries(REGIONS).map(([slug, cfg]) => (
              <option key={slug} value={slug}>{cfg.name}</option>
            ))}
          </select>
          {vorschlag && (
            <p className="text-xs text-[#4E779F] mt-1">
              Zu Deiner PLZ passt: <strong>{REGIONS[vorschlag].name}</strong>.{' '}
              <button type="button" className="underline font-semibold text-[#2D6A4F]" onClick={() => { onRegionChange(vorschlag); setVorschlag(null) }}>
                Übernehmen
              </button>
            </p>
          )}
          {errors.region && <p id="reg-region-error" role="alert" className="text-red-600 text-xs mt-1">{errors.region}</p>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="reg-plz" className="block text-sm font-medium text-[#1E3249] mb-1">
              PLZ <span className="text-red-600" aria-hidden="true">*</span>
            </label>
            <input id="reg-plz"
              type="text"
              value={data.plz}
              onChange={(e) => onChange('plz', e.target.value.replace(/\D/g, ''))}
              onBlur={() => onBlurField('plz')}
              inputMode="numeric"
              autoComplete="postal-code"
              placeholder="54550"
              maxLength={5}
              className={inputClass(!!errors.plz)}
              aria-invalid={!!errors.plz}
              aria-describedby={errors.plz ? "reg-plz-error" : undefined}
            />
            {errors.plz && <p id="reg-plz-error" role="alert" className="text-red-600 text-xs mt-1">{errors.plz}</p>}
          </div>
          <div>
            <label htmlFor="reg-ort" className="block text-sm font-medium text-[#1E3249] mb-1">
              Ort <span className="text-red-600" aria-hidden="true">*</span>
            </label>
            <input id="reg-ort"
              type="text"
              value={data.ort}
              onChange={(e) => onChange('ort', e.target.value)}
              onBlur={() => onBlurField('ort')}
              autoComplete="address-level2"
              placeholder="Daun"
              className={inputClass(!!errors.ort)}
              aria-invalid={!!errors.ort}
              aria-describedby={errors.ort ? "reg-ort-error" : undefined}
            />
            {errors.ort && <p id="reg-ort-error" role="alert" className="text-red-600 text-xs mt-1">{errors.ort}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="reg-ortschaft" className="block text-sm font-medium text-[#1E3249] mb-1">
            Ortschaft <span className="text-[#7A9DBF] font-normal">(optional)</span>
          </label>
          <input id="reg-ortschaft"
            type="text"
            value={data.ortschaft}
            onChange={(e) => onChange('ortschaft', e.target.value)}
            placeholder="z.B. Gillenfeld, Gerolstein, Daun…"
            className="w-full border border-[#C8D8EC] rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2E4A6B]/30"
          />
        </div>

        <div>
          <label htmlFor="reg-phone" className="block text-sm font-medium text-[#1E3249] mb-1">
            Telefon <span className="text-[#7A9DBF] font-normal">(optional)</span>
          </label>
          <input id="reg-phone"
            type="tel"
            value={data.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            placeholder="+49 6592 …"
            className="w-full border border-[#C8D8EC] rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2E4A6B]/30"
          />
        </div>
      </div>
    </div>
  )
}
