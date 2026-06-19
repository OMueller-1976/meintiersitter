import type { WizardFormData, WizardErrors } from '../OnboardingWizard'

interface Props {
  data: WizardFormData
  onChange: <K extends keyof WizardFormData>(key: K, value: WizardFormData[K]) => void
  errors: WizardErrors
}

export default function StepAdresse({ data, onChange, errors }: Props) {
  const inputClass = (hasError: boolean) =>
    `w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2E4A6B]/30 ${
      hasError ? 'border-red-400' : 'border-[#C8D8EC]'
    }`

  return (
    <div>
      <h2 className="text-xl font-bold text-[#1E3249] mb-1">Wo bist Du zu Hause?</h2>
      <p className="text-sm text-[#4E779F] mb-6">
        Damit wir Dich mit der Community in Deiner Nähe verbinden können.
      </p>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-[#1E3249] mb-1">
              PLZ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.plz}
              onChange={(e) => onChange('plz', e.target.value)}
              placeholder="54550"
              maxLength={5}
              className={inputClass(!!errors.plz)}
            />
            {errors.plz && <p className="text-red-500 text-xs mt-1">{errors.plz}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1E3249] mb-1">
              Ort <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.ort}
              onChange={(e) => onChange('ort', e.target.value)}
              placeholder="Daun"
              className={inputClass(!!errors.ort)}
            />
            {errors.ort && <p className="text-red-500 text-xs mt-1">{errors.ort}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1E3249] mb-1">
            Ortschaft <span className="text-[#7A9DBF] font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={data.ortschaft}
            onChange={(e) => onChange('ortschaft', e.target.value)}
            placeholder="z.B. Gillenfeld, Gerolstein, Daun…"
            className="w-full border border-[#C8D8EC] rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2E4A6B]/30"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1E3249] mb-1">
            Telefon <span className="text-[#7A9DBF] font-normal">(optional)</span>
          </label>
          <input
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
