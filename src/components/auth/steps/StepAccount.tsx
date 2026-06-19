import { useState } from 'react'
import type { WizardFormData, WizardErrors } from '../OnboardingWizard'

interface Props {
  data: WizardFormData
  onChange: <K extends keyof WizardFormData>(key: K, value: WizardFormData[K]) => void
  errors: WizardErrors
}

function Field({ label, required, error, children }: {
  label: string; required?: boolean; error?: string; children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#1E3249] mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

export default function StepAccount({ data, onChange, errors }: Props) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const inputClass = (hasError: boolean) =>
    `w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2E4A6B]/30 ${
      hasError ? 'border-red-400' : 'border-[#C8D8EC]'
    }`

  return (
    <div>
      <h2 className="text-xl font-bold text-[#1E3249] mb-6">Dein Konto</h2>

      <div className="flex flex-col gap-4">
        <Field label="Vollständiger Name" required error={errors.full_name}>
          <input
            type="text"
            value={data.full_name}
            onChange={(e) => onChange('full_name', e.target.value)}
            placeholder="Max Mustermann"
            className={inputClass(!!errors.full_name)}
          />
        </Field>

        <Field label="E-Mail" required error={errors.email}>
          <input
            type="email"
            value={data.email}
            onChange={(e) => onChange('email', e.target.value)}
            placeholder="max@beispiel.de"
            className={inputClass(!!errors.email)}
          />
        </Field>

        <Field label="Passwort" required error={errors.password}>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={data.password}
              onChange={(e) => onChange('password', e.target.value)}
              placeholder="Mindestens 8 Zeichen"
              className={inputClass(!!errors.password) + ' pr-20'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A9DBF] hover:text-[#2E4A6B] text-xs"
            >
              {showPassword ? 'Verbergen' : 'Zeigen'}
            </button>
          </div>
        </Field>

        <Field label="Passwort bestätigen" required error={errors.passwordConfirm}>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              value={data.passwordConfirm}
              onChange={(e) => onChange('passwordConfirm', e.target.value)}
              placeholder="Passwort wiederholen"
              className={inputClass(!!errors.passwordConfirm) + ' pr-20'}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A9DBF] hover:text-[#2E4A6B] text-xs"
            >
              {showConfirm ? 'Verbergen' : 'Zeigen'}
            </button>
          </div>
        </Field>
      </div>
    </div>
  )
}
