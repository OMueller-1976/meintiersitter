'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { loginAction } from './actions';

function ConfirmErrorBanner() {
  const searchParams = useSearchParams();
  if (searchParams.get('error') !== 'email_confirmation_failed') return null;
  return (
    <div className="mb-5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
      Die E-Mail-Bestätigung ist fehlgeschlagen. Bitte versuche es erneut oder registriere Dich neu.
    </div>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function validate(): boolean {
    let valid = true;
    setEmailError('');
    setPasswordError('');
    if (!email.trim()) {
      setEmailError('E-Mail ist erforderlich.');
      valid = false;
    }
    if (!password) {
      setPasswordError('Passwort ist erforderlich.');
      valid = false;
    }
    return valid;
  }

  async function handleSubmit() {
    if (!validate()) return;

    setIsLoading(true);
    try {
      const result = await loginAction(email, password);
      if (result?.error) {
        toast.error(result.error);
        setIsLoading(false);
      }
      // On success, server action calls redirect('/dashboard')
    } catch {
      toast.error('Ein unbekannter Fehler ist aufgetreten.');
      setIsLoading(false);
    }
  }

  const inputStyle = {
    width: '100%',
    background: '#f0f4f8',
    border: '1.5px solid #d0e4f7',
    borderRadius: 12,
    padding: '10px 14px',
    color: '#1a1a2e',
    fontSize: 15,
    outline: 'none',
    fontFamily: 'inherit',
  } as const;

  const inputErrorStyle = {
    ...inputStyle,
    border: '1.5px solid #f87171',
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: 'linear-gradient(135deg, #0f4c81 0%, #1a7a5e 50%, #0d6e8a 100%)' }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-3xl font-extrabold text-white">🐾 Tiersitti</span>
          </Link>
          <p className="text-white/60 text-sm mt-1">Tierbetreuung in Deiner Region</p>
        </div>

        <div className="p-8 md:p-10 rounded-2xl" style={{ background: '#ffffff', border: '1.5px solid #d0e4f7', boxShadow: '0 4px 20px rgba(15,76,129,0.12)' }}>
          <Suspense fallback={null}>
            <ConfirmErrorBanner />
          </Suspense>
          <h1 className="text-xl font-bold mb-1 text-center" style={{ color: '#1a1a2e' }}>Willkommen zurück</h1>
          <p className="text-sm text-center mb-8" style={{ color: '#718096' }}>Melde Dich mit Deinem Konto an.</p>

          <div className="flex flex-col gap-5">
            {/* E-Mail */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#4a5568' }}>E-Mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError('');
                }}
                placeholder="max@beispiel.de"
                autoComplete="email"
                style={emailError ? inputErrorStyle : inputStyle}
              />
              {emailError && <p className="text-red-400 text-xs mt-1">{emailError}</p>}
            </div>

            {/* Passwort */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#4a5568' }}>Passwort</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError('');
                  }}
                  placeholder="Dein Passwort"
                  autoComplete="current-password"
                  style={passwordError ? { ...inputErrorStyle, paddingRight: 80 } : { ...inputStyle, paddingRight: 80 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs transition-colors" style={{ color: '#718096' }}
                >
                  {showPassword ? 'Verbergen' : 'Zeigen'}
                </button>
              </div>
              {passwordError && <p className="text-red-400 text-xs mt-1">{passwordError}</p>}
              <div className="text-right mt-1.5">
                <Link href="/passwort-vergessen" className="text-xs transition-colors" style={{ color: '#718096' }}>
                  Passwort vergessen?
                </Link>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-3 rounded-2xl font-bold text-sm transition-opacity disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
              style={{ background: 'linear-gradient(135deg, #0f4c81 0%, #1a7a5e 100%)', color: '#ffffff' }}
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-black/20 border-t-black/60 rounded-full animate-spin" />
                  Anmelden…
                </>
              ) : (
                'Anmelden'
              )}
            </button>
          </div>

          <p className="text-center text-sm mt-6" style={{ color: '#718096' }}>
            Noch kein Konto?{' '}
            <Link href="/register" className="font-semibold transition-colors" style={{ color: '#0f4c81' }}>
              Jetzt registrieren →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
