'use client';

import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { createBrowserClient } from '@supabase/ssr';
import { registerAction } from './actions';
import type { UserRole } from '@/types';

interface FormFields {
  full_name: string;
  email: string;
  password: string;
  password_confirm: string;
  plz: string;
  ort: string;
  ortschaft: string;
  phone: string;
  agb: boolean;
}

type FieldErrors = Partial<Record<keyof FormFields, string>>;

const INITIAL: FormFields = {
  full_name: '',
  email: '',
  password: '',
  password_confirm: '',
  plz: '',
  ort: '',
  ortschaft: '',
  phone: '',
  agb: false,
};

function validate(fields: FormFields): FieldErrors {
  const errors: FieldErrors = {};
  if (!fields.full_name.trim()) errors.full_name = 'Name ist erforderlich.';
  if (!fields.email.trim()) errors.email = 'E-Mail ist erforderlich.';
  if (!fields.password) errors.password = 'Passwort ist erforderlich.';
  else if (fields.password.length < 8) errors.password = 'Mindestens 8 Zeichen.';
  if (!fields.password_confirm) errors.password_confirm = 'Bitte Passwort bestätigen.';
  else if (fields.password !== fields.password_confirm)
    errors.password_confirm = 'Passwörter stimmen nicht überein.';
  if (!fields.plz.trim()) errors.plz = 'PLZ ist erforderlich.';
  else if (!/^\d{5}$/.test(fields.plz)) errors.plz = 'PLZ muss 5 Ziffern haben.';
  if (!fields.ort.trim()) errors.ort = 'Ort ist erforderlich.';
  if (!fields.agb) errors.agb = 'Bitte AGB und Datenschutz akzeptieren.';
  return errors;
}

const TRUST_PILLS = [
  '✓ DSGVO-konform',
  '✓ Keine Provision',
  '✓ Jederzeit kündbar',
  '✓ Nur Vulkaneifel',
];

export default function RegisterPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<UserRole | null>(null);
  const [fields, setFields] = useState<FormFields>(INITIAL);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [resending, setResending] = useState(false);

  function set(key: keyof FormFields, value: string | boolean) {
    setFields((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function handleRoleSelect(r: UserRole) {
    setRole(r);
    setStep(2);
  }

  async function handleSubmit() {
    const fieldErrors = validate(fields);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    if (!role) return;

    setIsLoading(true);
    try {
      const result = await registerAction({
        role,
        full_name: fields.full_name,
        email: fields.email,
        password: fields.password,
        plz: fields.plz,
        ort: fields.ort,
        ortschaft: fields.ortschaft || undefined,
        phone: fields.phone || undefined,
      });
      if (result && 'error' in result) {
        toast.error(result.error);
        setIsLoading(false);
      } else if (result && 'success' in result) {
        setRegisteredEmail(result.email);
        setRegistered(true);
      }
    } catch {
      toast.error('Ein unbekannter Fehler ist aufgetreten.');
      setIsLoading(false);
    }
  }

  async function handleResend() {
    if (!registeredEmail) return;
    setResending(true);
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: registeredEmail,
        options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback` },
      });
      if (error) toast.error(error.message);
      else toast.success('E-Mail wurde erneut gesendet!');
    } finally {
      setResending(false);
    }
  }

  if (registered) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(135deg, #0f4c81 0%, #1a7a5e 50%, #0d6e8a 100%)' }}>
        <div className="bg-white rounded-2xl shadow-md border border-[#C8D8EC] p-10 max-w-md w-full text-center">
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0f4c81 0%, #1a7a5e 50%, #0d6e8a 100%)' }}>
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col lg:flex-row gap-10 lg:gap-16 lg:items-start">

        {/* ══════════════════════════════════════════
            LINKE SEITE — Werblicher Content
        ══════════════════════════════════════════ */}
        <div className="flex-1 lg:py-4">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <span className="text-2xl font-bold text-white">🐾 Tiersitti</span>
          </Link>
          <p className="text-xs text-white/60 -mt-7 mb-8 ml-9">Tierbetreuung in Deiner Region</p>

          {/* Hero-Text */}
          <h1 className="text-3xl font-bold text-white leading-snug mb-4">
            Willkommen in der<br />
            Tiersitter-Community<br />
            der Vulkaneifel 🐾
          </h1>
          <p className="text-lg text-white/75 mb-8 leading-relaxed">
            Von Daun bis Gerolstein, von Manderscheid bis Gillenfeld — hier hilft die Nachbarschaft
            einander. Kostenlos. Persönlich. Mit Herz.
          </p>

          {/* 3 Kacheln */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {/* Kachel 1: Tierhalter */}
            <div className="bg-white border border-[#C8D8EC] rounded-2xl p-5">
              <div className="text-3xl mb-3">🐕</div>
              <div className="font-semibold text-[#1E3249] text-sm mb-2">Du hast ein Tier?</div>
              <p className="text-xs text-[#4E779F] leading-relaxed mb-3">
                Finde liebevolle Sitter direkt in Deiner Ortschaft. Keine Vermittlungsgebühr, kein Stress.
              </p>
              <span className="inline-block bg-[#EEF2F8] text-[#2E4A6B] rounded-full px-3 py-1 text-xs font-medium">
                €1,90 / Monat
              </span>
            </div>

            {/* Kachel 2: Sitter */}
            <div className="bg-[#2E4A6B] rounded-2xl p-5">
              <div className="text-3xl mb-3">🤝</div>
              <div className="font-semibold text-white text-sm mb-2">Du liebst Tiere?</div>
              <p className="text-xs text-[#A8C0DC] leading-relaxed mb-3">
                Werde Sitter — kostenlos, ohne Verpflichtung und ganz nach Deinen eigenen Zeiten.
                Hilf einem Tier in Deiner Nachbarschaft.
              </p>
              <span className="inline-block bg-white/20 text-white rounded-full px-3 py-1 text-xs font-medium">
                Dauerhaft kostenlos
              </span>
            </div>

            {/* Kachel 3: Community */}
            <div className="bg-white border border-[#C8D8EC] rounded-2xl p-5">
              <div className="text-3xl mb-3">🌋</div>
              <div className="font-semibold text-[#1E3249] text-sm mb-2">100% lokal & regional</div>
              <p className="text-xs text-[#4E779F] leading-relaxed">
                MeinTiersitter ist ein Projekt aus der Vulkaneifel — für die Menschen und Tiere
                hier vor Ort. Entstanden aus einer Idee in der Facebook-Community des Kreises Daun.
              </p>
            </div>
          </div>

          {/* Trust-Zeile */}
          <div className="flex flex-wrap gap-2 mb-6">
            {TRUST_PILLS.map((pill) => (
              <span
                key={pill}
                className="bg-white/20 text-white text-xs rounded-full px-3 py-1 font-medium"
              >
                {pill}
              </span>
            ))}
          </div>

          {/* Testimonial */}
          <div className="bg-white/15 rounded-2xl p-5 backdrop-blur-sm">
            <div className="text-5xl text-[#C8D8EC] leading-none mb-2">&ldquo;</div>
            <p className="text-sm text-white leading-relaxed mb-3 -mt-2">
              Endlich eine Plattform nur für unsere Region! Ich habe innerhalb von einem Tag einen
              tollen Sitter für meinen Hund gefunden.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70 font-medium">— Familie Müller, Daun</span>
              <span className="text-sm">⭐⭐⭐⭐⭐</span>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            RECHTE SEITE — Formular
        ══════════════════════════════════════════ */}
        <div className="w-full lg:max-w-md lg:flex-shrink-0 lg:sticky lg:top-8">
          {/* Mitglieder-Badge */}
          <div className="flex justify-center mb-4">
            <span className="inline-flex items-center gap-1.5 bg-[#2E4A6B] text-white text-xs font-medium px-4 py-1.5 rounded-full shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#4ade80] inline-block"></span>
              47+ Mitglieder in der Vulkaneifel
            </span>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-[#C8D8EC] p-8">

            {/* ── STEP 1: Rolle wählen ─────────────────── */}
            {step === 1 && (
              <>
                <h2 className="text-xl font-bold text-[#1E3249] mb-2 text-center">
                  Kostenlos registrieren
                </h2>
                <p className="text-[#4E779F] text-sm text-center mb-8">
                  Wähle zunächst Deine Rolle:
                </p>

                <div className="grid grid-cols-2 gap-4">
                  {/* Tierhalter-Kachel */}
                  <button
                    onClick={() => handleRoleSelect('tierhalter')}
                    className="relative overflow-hidden flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-[#C8D8EC] hover:border-[#2E4A6B] hover:bg-[#EEF2F8] transition-all text-center group"
                  >
                    {/* Deko-Bild */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/assets/Hund.png"
                      alt=""
                      aria-hidden="true"
                      className="absolute top-1 right-1 w-14 h-14 object-cover opacity-10 pointer-events-none select-none"
                    />
                    <span className="text-4xl relative z-10">🐕</span>
                    <div className="relative z-10">
                      <div className="font-semibold text-[#1E3249] text-sm group-hover:text-[#2E4A6B]">
                        Ich suche einen Sitter
                      </div>
                      <div className="text-xs text-[#7A9DBF] mt-0.5">Tierhalter · €1,90/Monat</div>
                    </div>
                  </button>

                  {/* Sitter-Kachel */}
                  <button
                    onClick={() => handleRoleSelect('sitter')}
                    className="relative overflow-hidden flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-[#C8D8EC] hover:border-[#F4A261] hover:bg-orange-50 transition-all text-center group"
                  >
                    {/* Deko-Bild */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/assets/Familie.png"
                      alt=""
                      aria-hidden="true"
                      className="absolute top-1 right-1 w-14 h-14 object-cover opacity-10 pointer-events-none select-none rounded-full"
                    />
                    <span className="text-4xl relative z-10">🤝</span>
                    <div className="relative z-10">
                      <div className="font-semibold text-[#1E3249] text-sm group-hover:text-[#F4A261]">
                        Ich biete Sitter-Dienste an
                      </div>
                      <div className="text-xs text-[#7A9DBF] mt-0.5">Sitter · Kostenlos</div>
                    </div>
                  </button>
                </div>

                <p className="text-center text-sm text-[#4E779F] mt-8">
                  Bereits registriert?{' '}
                  <Link href="/login" className="text-[#2E4A6B] font-medium hover:underline">
                    Anmelden →
                  </Link>
                </p>
              </>
            )}

            {/* ── STEP 2: Formular ──────────────────────── */}
            {step === 2 && role && (
              <>
                {/* Header mit Zurück-Button */}
                <div className="flex items-center gap-3 mb-6">
                  <button
                    onClick={() => setStep(1)}
                    className="text-[#7A9DBF] hover:text-[#2E4A6B] text-lg leading-none"
                    aria-label="Zurück"
                  >
                    ←
                  </button>
                  <div>
                    <h2 className="text-lg font-bold text-[#1E3249]">Konto erstellen</h2>
                    <p className="text-xs text-[#7A9DBF]">
                      Als{' '}
                      <span
                        className={`font-medium ${
                          role === 'tierhalter' ? 'text-[#2E4A6B]' : 'text-[#F4A261]'
                        }`}
                      >
                        {role === 'tierhalter' ? 'Tierhalter' : 'Sitter'}
                      </span>{' '}
                      registrieren
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Vollständiger Name */}
                  <div>
                    <label className="block text-sm font-medium text-[#1E3249] mb-1">
                      Vollständiger Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={fields.full_name}
                      onChange={(e) => set('full_name', e.target.value)}
                      placeholder="Max Mustermann"
                      className={`w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2E4A6B]/30 ${
                        errors.full_name ? 'border-red-400' : 'border-[#C8D8EC]'
                      }`}
                    />
                    {errors.full_name && (
                      <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>
                    )}
                  </div>

                  {/* E-Mail */}
                  <div>
                    <label className="block text-sm font-medium text-[#1E3249] mb-1">
                      E-Mail <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={fields.email}
                      onChange={(e) => set('email', e.target.value)}
                      placeholder="max@beispiel.de"
                      className={`w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2E4A6B]/30 ${
                        errors.email ? 'border-red-400' : 'border-[#C8D8EC]'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Passwort */}
                  <div>
                    <label className="block text-sm font-medium text-[#1E3249] mb-1">
                      Passwort <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={fields.password}
                        onChange={(e) => set('password', e.target.value)}
                        placeholder="Mindestens 8 Zeichen"
                        className={`w-full border rounded-xl px-3 py-2.5 pr-20 text-sm outline-none focus:ring-2 focus:ring-[#2E4A6B]/30 ${
                          errors.password ? 'border-red-400' : 'border-[#C8D8EC]'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A9DBF] hover:text-[#2E4A6B] text-xs"
                      >
                        {showPassword ? 'Verbergen' : 'Zeigen'}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                    )}
                  </div>

                  {/* Passwort bestätigen */}
                  <div>
                    <label className="block text-sm font-medium text-[#1E3249] mb-1">
                      Passwort bestätigen <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        value={fields.password_confirm}
                        onChange={(e) => set('password_confirm', e.target.value)}
                        placeholder="Passwort wiederholen"
                        className={`w-full border rounded-xl px-3 py-2.5 pr-20 text-sm outline-none focus:ring-2 focus:ring-[#2E4A6B]/30 ${
                          errors.password_confirm ? 'border-red-400' : 'border-[#C8D8EC]'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A9DBF] hover:text-[#2E4A6B] text-xs"
                      >
                        {showConfirm ? 'Verbergen' : 'Zeigen'}
                      </button>
                    </div>
                    {errors.password_confirm && (
                      <p className="text-red-500 text-xs mt-1">{errors.password_confirm}</p>
                    )}
                  </div>

                  {/* PLZ + Ort */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-[#1E3249] mb-1">
                        PLZ <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={fields.plz}
                        onChange={(e) => set('plz', e.target.value)}
                        placeholder="54550"
                        maxLength={5}
                        className={`w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2E4A6B]/30 ${
                          errors.plz ? 'border-red-400' : 'border-[#C8D8EC]'
                        }`}
                      />
                      {errors.plz && (
                        <p className="text-red-500 text-xs mt-1">{errors.plz}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1E3249] mb-1">
                        Ort <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={fields.ort}
                        onChange={(e) => set('ort', e.target.value)}
                        placeholder="Daun"
                        className={`w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2E4A6B]/30 ${
                          errors.ort ? 'border-red-400' : 'border-[#C8D8EC]'
                        }`}
                      />
                      {errors.ort && (
                        <p className="text-red-500 text-xs mt-1">{errors.ort}</p>
                      )}
                    </div>
                  </div>

                  {/* Ortschaft */}
                  <div>
                    <label className="block text-sm font-medium text-[#1E3249] mb-1">
                      Ortschaft{' '}
                      <span className="text-[#7A9DBF] font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={fields.ortschaft}
                      onChange={(e) => set('ortschaft', e.target.value)}
                      placeholder="z.B. Gillenfeld, Manderscheid, Daun..."
                      className="w-full border border-[#C8D8EC] rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2E4A6B]/30"
                    />
                  </div>

                  {/* Telefon */}
                  <div>
                    <label className="block text-sm font-medium text-[#1E3249] mb-1">
                      Telefon{' '}
                      <span className="text-[#7A9DBF] font-normal">(optional)</span>
                    </label>
                    <input
                      type="tel"
                      value={fields.phone}
                      onChange={(e) => set('phone', e.target.value)}
                      placeholder="+49 6592 ..."
                      className="w-full border border-[#C8D8EC] rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2E4A6B]/30"
                    />
                  </div>

                  {/* AGB */}
                  <div>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={fields.agb}
                        onChange={(e) => set('agb', e.target.checked)}
                        className="mt-0.5 w-4 h-4 accent-[#2E4A6B] flex-shrink-0"
                      />
                      <span className="text-sm text-[#4E779F]">
                        Ich akzeptiere die{' '}
                        <Link href="/agb" className="text-[#2E4A6B] hover:underline">
                          AGB
                        </Link>{' '}
                        und die{' '}
                        <Link href="/datenschutz" className="text-[#2E4A6B] hover:underline">
                          Datenschutzerklärung
                        </Link>
                        .
                      </span>
                    </label>
                    {errors.agb && (
                      <p className="text-red-500 text-xs mt-1">{errors.agb}</p>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-full bg-[#2E4A6B] text-white py-3 rounded-2xl font-medium hover:bg-[#3A5A80] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                  >
                    {isLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Konto wird erstellt…
                      </>
                    ) : (
                      'Konto erstellen'
                    )}
                  </button>
                </div>

                <p className="text-center text-sm text-[#4E779F] mt-6">
                  Bereits registriert?{' '}
                  <Link href="/login" className="text-[#2E4A6B] font-medium hover:underline">
                    Anmelden →
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
