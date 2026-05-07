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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEF2F8] to-[#D4E3F0] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-bold text-[#2E4A6B]">🐾 MeinTiersitter</span>
          </Link>
          <p className="text-[#4E779F] text-sm mt-1">Kreis Daun · Vulkaneifel</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-[#C8D8EC] p-8">
          <h1 className="text-xl font-bold text-[#1E3249] mb-2 text-center">Willkommen zurück</h1>
          <p className="text-[#4E779F] text-sm text-center mb-8">Melde Dich mit Deinem Konto an.</p>

          <div className="flex flex-col gap-4">
            {/* E-Mail */}
            <div>
              <label className="block text-sm font-medium text-[#1E3249] mb-1">E-Mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError('');
                }}
                placeholder="max@beispiel.de"
                autoComplete="email"
                className={`w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2E4A6B]/30 ${
                  emailError ? 'border-red-400' : 'border-[#C8D8EC]'
                }`}
              />
              {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
            </div>

            {/* Passwort */}
            <div>
              <label className="block text-sm font-medium text-[#1E3249] mb-1">Passwort</label>
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
                  className={`w-full border rounded-xl px-3 py-2.5 pr-20 text-sm outline-none focus:ring-2 focus:ring-[#2E4A6B]/30 ${
                    passwordError ? 'border-red-400' : 'border-[#C8D8EC]'
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
              {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
              <div className="text-right mt-1.5">
                <Link
                  href="/passwort-vergessen"
                  className="text-xs text-[#7A9DBF] hover:text-[#2E4A6B] transition-colors"
                >
                  Passwort vergessen?
                </Link>
              </div>
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
                  Anmelden…
                </>
              ) : (
                'Anmelden'
              )}
            </button>
          </div>

          <p className="text-center text-sm text-[#4E779F] mt-6">
            Noch kein Konto?{' '}
            <Link href="/register" className="text-[#2E4A6B] font-medium hover:underline">
              Jetzt registrieren →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
