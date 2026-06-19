'use client'

import { useMemo, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import toast from 'react-hot-toast'
import Link from 'next/link'
import WizardProgress from './WizardProgress'
import StepRolle from './steps/StepRolle'
import StepAccount from './steps/StepAccount'
import StepAdresse from './steps/StepAdresse'
import StepSitterDetails from './steps/StepSitterDetails'
import StepZusammenfassung from './steps/StepZusammenfassung'
import SpendenHinweis from '@/components/shared/SpendenHinweis'
import { registerAction } from '@/app/(auth)/register/actions'

export type WizardRole = 'tierhalter' | 'sitter' | 'beide'

export interface WizardFormData {
  rolle: WizardRole | null
  // Account
  full_name: string
  email: string
  password: string
  passwordConfirm: string
  // Adresse
  plz: string
  ort: string
  ortschaft: string
  phone: string
  // Sitter-Details
  erfahrung_jahre: number
  hat_eigene_tiere: boolean
  hat_garten: boolean
  kann_medikamente: boolean
  betreut_hunde: boolean
  betreut_katzen: boolean
  betreut_kleintiere: boolean
  bietet_gassi: boolean
  bietet_fuettern: boolean
  bietet_tagesbetreuung: boolean
  bietet_uebernachtung: boolean
  radius_km: number
  // Notfall
  notfall_verfuegbar: boolean
  notfall_telefon: string
  notfall_per_email: boolean
  notfall_per_sms: boolean
  notfall_per_whatsapp: boolean
  // Abschluss
  agb_akzeptiert: boolean
}

export type WizardErrors = Partial<Record<string, string>>

const INITIAL_DATA: WizardFormData = {
  rolle: null,
  full_name: '', email: '', password: '', passwordConfirm: '',
  plz: '', ort: '', ortschaft: '', phone: '',
  erfahrung_jahre: 0, hat_eigene_tiere: false, hat_garten: false,
  kann_medikamente: false, betreut_hunde: true, betreut_katzen: true,
  betreut_kleintiere: false, bietet_gassi: true, bietet_fuettern: true,
  bietet_tagesbetreuung: false, bietet_uebernachtung: false, radius_km: 10,
  notfall_verfuegbar: false, notfall_telefon: '', notfall_per_email: true,
  notfall_per_sms: false, notfall_per_whatsapp: false,
  agb_akzeptiert: false,
}

type Step = 'rolle' | 'account' | 'adresse' | 'sitter-details' | 'zusammenfassung'

const STEP_LABELS: Record<Step, string> = {
  'rolle': 'Deine Rolle',
  'account': 'Konto',
  'adresse': 'Adresse',
  'sitter-details': 'Sitter-Details',
  'zusammenfassung': 'Abschluss',
}

export default function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<WizardFormData>(INITIAL_DATA)
  const [errors, setErrors] = useState<WizardErrors>({})
  const [loading, setLoading] = useState(false)
  const [registered, setRegistered] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')
  const [resending, setResending] = useState(false)

  const steps = useMemo<Step[]>(() => {
    const base: Step[] = ['rolle', 'account', 'adresse']
    if (formData.rolle === 'sitter' || formData.rolle === 'beide') {
      base.push('sitter-details')
    }
    base.push('zusammenfassung')
    return base
  }, [formData.rolle])

  function updateField<K extends keyof WizardFormData>(key: K, value: WizardFormData[K]) {
    setFormData(prev => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }))
  }

  function canProceed(): boolean {
    const step = steps[currentStep]
    switch (step) {
      case 'rolle':
        return formData.rolle !== null
      case 'account':
        return (
          formData.full_name.trim().length > 0 &&
          formData.email.trim().length > 0 &&
          formData.password.length >= 8 &&
          formData.password === formData.passwordConfirm
        )
      case 'adresse':
        return /^\d{5}$/.test(formData.plz) && formData.ort.trim().length > 0
      case 'sitter-details':
        return true
      case 'zusammenfassung':
        return true
      default:
        return false
    }
  }

  function validateStep(): WizardErrors {
    const step = steps[currentStep]
    const e: WizardErrors = {}
    if (step === 'account') {
      if (!formData.full_name.trim()) e.full_name = 'Name ist erforderlich.'
      if (!formData.email.trim()) e.email = 'E-Mail ist erforderlich.'
      if (formData.password.length < 8) e.password = 'Mindestens 8 Zeichen.'
      if (formData.password !== formData.passwordConfirm) e.passwordConfirm = 'Passwörter stimmen nicht überein.'
    }
    if (step === 'adresse') {
      if (!/^\d{5}$/.test(formData.plz)) e.plz = 'PLZ muss 5 Ziffern haben.'
      if (!formData.ort.trim()) e.ort = 'Ort ist erforderlich.'
    }
    return e
  }

  function handleNext() {
    const e = validateStep()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    setErrors({})
    setCurrentStep(prev => prev + 1)
  }

  function handleBack() {
    setErrors({})
    setCurrentStep(prev => Math.max(0, prev - 1))
  }

  async function handleSubmit() {
    if (!formData.agb_akzeptiert) {
      setErrors({ agb_akzeptiert: 'Bitte AGB akzeptieren.' })
      return
    }
    if (!formData.rolle) return
    setLoading(true)
    try {
      const sitterData = (formData.rolle === 'sitter' || formData.rolle === 'beide')
        ? JSON.stringify({
            erfahrung_jahre: formData.erfahrung_jahre,
            hat_eigene_tiere: formData.hat_eigene_tiere,
            hat_garten: formData.hat_garten,
            kann_medikamente: formData.kann_medikamente,
            betreut_hunde: formData.betreut_hunde,
            betreut_katzen: formData.betreut_katzen,
            betreut_kleintiere: formData.betreut_kleintiere,
            bietet_gassi: formData.bietet_gassi,
            bietet_fuettern: formData.bietet_fuettern,
            bietet_tagesbetreuung: formData.bietet_tagesbetreuung,
            bietet_uebernachtung: formData.bietet_uebernachtung,
            radius_km: formData.radius_km,
            notfall_verfuegbar: formData.notfall_verfuegbar,
            notfall_telefon: formData.notfall_telefon || null,
            notfall_per_email: formData.notfall_per_email,
            notfall_per_sms: formData.notfall_per_sms,
            notfall_per_whatsapp: formData.notfall_per_whatsapp,
          })
        : null

      const result = await registerAction({
        role: formData.rolle,
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
        plz: formData.plz,
        ort: formData.ort,
        ortschaft: formData.ortschaft || undefined,
        phone: formData.phone || undefined,
        sitter_data: sitterData ?? undefined,
      })

      if (result && 'error' in result) {
        toast.error(result.error)
      } else if (result && 'success' in result) {
        setRegisteredEmail(result.email)
        setRegistered(true)
      }
    } catch {
      toast.error('Ein unbekannter Fehler ist aufgetreten.')
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    if (!registeredEmail) return
    setResending(true)
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: registeredEmail,
        options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback` },
      })
      if (error) toast.error(error.message)
      else toast.success('E-Mail wurde erneut gesendet!')
    } finally {
      setResending(false)
    }
  }

  // ── E-Mail-Bestätigung State ──
  if (registered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#EEF2F8] to-[#D4E3F0] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10 text-center">
          <div className="text-6xl mb-4">📬</div>
          <h2 className="text-xl font-bold text-[#1E3249] mb-2">Bitte E-Mail bestätigen</h2>
          <p className="text-sm text-[#4E779F] mb-2 leading-relaxed">
            Wir haben eine Bestätigungs-E-Mail an
          </p>
          <p className="font-semibold text-[#2E4A6B] mb-4 break-all">{registeredEmail}</p>
          <p className="text-sm text-[#4E779F] mb-8 leading-relaxed">
            gesendet. Bitte klicke auf den Link in der E-Mail, um Dein Konto zu aktivieren.
          </p>
          <button
            onClick={handleResend}
            disabled={resending}
            className="w-full border border-[#C8D8EC] text-[#2E4A6B] py-2.5 rounded-xl text-sm font-medium hover:bg-[#EEF2F8] transition-colors disabled:opacity-50 mb-4"
          >
            {resending ? 'Wird gesendet…' : 'E-Mail erneut senden'}
          </button>
          <Link href="/login" className="text-sm text-[#7A9DBF] hover:text-[#2E4A6B] hover:underline">
            Zur Anmeldung →
          </Link>
          <div className="mt-6 pt-6 border-t border-[#EEF2F8] text-left">
            <SpendenHinweis variant="kompakt" />
          </div>
        </div>
      </div>
    )
  }

  const currentStepId = steps[currentStep]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEF2F8] to-[#D4E3F0] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* Header */}
        <div className="bg-[#2E4A6B] px-8 py-5">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🐾</span>
            <div>
              <p className="text-white font-semibold">MeinTiersitter</p>
              <p className="text-white/60 text-xs">Landkreis Vulkaneifel</p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="px-8 pt-6">
          <WizardProgress steps={steps} currentStep={currentStep} labels={STEP_LABELS} />
        </div>

        {/* Step Content */}
        <div className="px-8 py-6 min-h-[400px]">
          {currentStepId === 'rolle' && (
            <StepRolle
              value={formData.rolle}
              onChange={(r) => updateField('rolle', r)}
            />
          )}
          {currentStepId === 'account' && (
            <StepAccount data={formData} onChange={updateField} errors={errors} />
          )}
          {currentStepId === 'adresse' && (
            <StepAdresse data={formData} onChange={updateField} errors={errors} />
          )}
          {currentStepId === 'sitter-details' && (
            <StepSitterDetails data={formData} onChange={updateField} />
          )}
          {currentStepId === 'zusammenfassung' && (
            <StepZusammenfassung data={formData} onChange={updateField} errors={errors} />
          )}
        </div>

        {/* Navigation Footer */}
        <div className="px-8 py-5 border-t border-[#EEF2F8] flex justify-between items-center">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="text-sm text-[#4E779F] disabled:opacity-0 hover:text-[#2E4A6B] transition-colors"
          >
            ← Zurück
          </button>

          <span className="text-xs text-[#7A9DBF]">
            Schritt {currentStep + 1} von {steps.length}
          </span>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-[#2E4A6B] text-white px-6 py-2.5 rounded-xl text-sm font-medium disabled:opacity-40 hover:bg-[#3A5A80] transition-colors"
            >
              Weiter →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!formData.agb_akzeptiert || loading}
              className="bg-[#2E4A6B] text-white px-6 py-2.5 rounded-xl text-sm font-medium disabled:opacity-40 hover:bg-[#3A5A80] transition-colors flex items-center gap-2"
            >
              {loading
                ? <><span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />Wird erstellt…</>
                : 'Konto erstellen ✓'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
