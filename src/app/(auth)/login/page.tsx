'use client';

import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { loginAction } from './actions';

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
    background: 'rgba(255,255,255,0.12)',
    border: '1px solid rgba(255,255,255,0.25)',
    borderRadius: 12,
    padding: '10px 14px',
    color: 'white',
    fontSize: 14,
    outline: 'none',
    fontFamily: 'inherit',
  } as const;

  const inputErrorStyle = {
    ...inputStyle,
    border: '1px solid rgba(248,113,113,0.7)',
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

        <div className="tile p-8 md:p-10">
          <h1 className="text-xl font-bold text-white mb-1 text-center">Willkommen zurück</h1>
          <p className="text-white/60 text-sm text-center mb-8">Melde Dich mit Deinem Konto an.</p>

          <div className="flex flex-col gap-5">
            {/* E-Mail */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1.5">E-Mail</label>
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
              <label className="block text-sm font-medium text-white/80 mb-1.5">Passwort</label>
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/50 hover:text-white transition-colors"
                >
                  {showPassword ? 'Verbergen' : 'Zeigen'}
                </button>
              </div>
              {passwordError && <p className="text-red-400 text-xs mt-1">{passwordError}</p>}
              <div className="text-right mt-1.5">
                <Link href="/passwort-vergessen" className="text-xs text-white/50 hover:text-white transition-colors">
                  Passwort vergessen?
                </Link>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-3 rounded-2xl font-bold text-sm transition-opacity disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
              style={{ background: 'var(--accent-green)', color: '#0f172a' }}
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

          <p className="text-center text-sm text-white/50 mt-6">
            Noch kein Konto?{' '}
            <Link href="/register" className="text-white font-semibold hover:text-white/80 transition-colors">
              Jetzt registrieren →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
