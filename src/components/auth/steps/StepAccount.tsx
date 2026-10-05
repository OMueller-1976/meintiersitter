import { useState } from 'react'
import type { WizardFormData, WizardErrors } from '../OnboardingWizard'

interface Props {
  data: WizardFormData
  onChange: <K extends keyof WizardFormData>(key: K, value: WizardFormData[K]) => void
  onBlurField: (key: keyof WizardFormData) => void
  errors: WizardErrors
}

function Field({ id, label, required, error, hint, children }: {
  id: string; label: string; required?: boolean; error?: string; hint?: string; children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-[#1E3249] mb-1">
        {label} {required && <span className="text-red-600" aria-hidden="true">*</span>}
      </label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className="text-[#4E779F] text-xs mt-1">{hint}</p>}
      {error && <p id={`${id}-error`} role="alert" className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  )
}

export default function StepAccount({ data, onChange, onBlurField, errors }: Props) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const inputClass = (hasError: boolean) =>
    `w-full border rounded-xl px-3 py-2.5 text-base sm:text-sm outline-none focus:ring-2 focus:ring-[#2E4A6B]/40 ${
      hasError ? 'border-red-500 bg-red-50' : 'border-[#C8D8EC]'
    }`

  const a11y = (id: string, error?: string, hint?: string) => ({
    id,
    'aria-invalid': !!error,
    'aria-describedby': error ? `${id}-error` : hint ? `${id}-hint` : undefined,
    'aria-required': true as const,
  })

  return (
    <div>
      <h2 className="text-xl font-bold text-[#1E3249] mb-6">Dein Konto</h2>

      <div className="flex flex-col gap-4">
        <Field id="reg-name" label="Vollständiger Name" required error={errors.full_name}>
          <input
            type="text"
            autoComplete="name"
            value={data.full_name}
            onChange={(e) => onChange('full_name', e.target.value)}
            onBlur={() => onBlurField('full_name')}
            placeholder="Max Mustermann"
            className={inputClass(!!errors.full_name)}
            {...a11y('reg-name', errors.full_name)}
          />
        </Field>

        <Field id="reg-email" label="E-Mail" required error={errors.email}>
          <input
            type="email"
            autoComplete="email"
            inputMode="email"
            value={data.email}
            onChange={(e) => onChange('email', e.target.value)}
            onBlur={() => onBlurField('email')}
            placeholder="max@beispiel.de"
            className={inputClass(!!errors.email)}
            {...a11y('reg-email', errors.email)}
          />
        </Field>

        <Field id="reg-pw" label="Passwort" required error={errors.password}
          hint="Mindestens 10 Zeichen, mit Buchstaben und Ziffern.">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={data.password}
              onChange={(e) => onChange('password', e.target.value)}
              onBlur={() => onBlurField('password')}
              placeholder="Mindestens 10 Zeichen"
              className={inputClass(!!errors.password) + ' pr-24'}
              {...a11y('reg-pw', errors.password, 'x')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-pressed={showPassword}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-2 text-[#4E779F] hover:text-[#2E4A6B] text-xs"
            >
              {showPassword ? 'Verbergen' : 'Zeigen'}
            </button>
          </div>
        </Field>

        <Field id="reg-pw2" label="Passwort bestätigen" required error={errors.passwordConfirm}>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              autoComplete="new-password"
              value={data.passwordConfirm}
              onChange={(e) => onChange('passwordConfirm', e.target.value)}
              onBlur={() => onBlurField('passwordConfirm')}
              placeholder="Passwort wiederholen"
              className={inputClass(!!errors.passwordConfirm) + ' pr-24'}
              {...a11y('reg-pw2', errors.passwordConfirm)}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              aria-pressed={showConfirm}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-2 text-[#4E779F] hover:text-[#2E4A6B] text-xs"
            >
              {showConfirm ? 'Verbergen' : 'Zeigen'}
            </button>
          </div>
        </Field>
      </div>
    </div>
  )
}
