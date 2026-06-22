'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';

export default function PasswortVergessenPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmailError('');

    if (!email.trim()) {
      setEmailError('E-Mail ist erforderlich.');
      return;
    }

    setIsLoading(true);
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: process.env.NEXT_PUBLIC_APP_URL + '/auth/callback?type=recovery',
    });
    // Immer Erfolgsmeldung zeigen — kein Hinweis ob E-Mail existiert
    setSubmitted(true);
    setIsLoading(false);
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

        <div
          className="p-8 md:p-10 rounded-2xl"
          style={{ background: '#ffffff', border: '1.5px solid #d0e4f7', boxShadow: '0 4px 20px rgba(15,76,129,0.12)' }}
        >
          {submitted ? (
            <div className="text-center">
              <div className="text-4xl mb-4">📬</div>
              <h1 className="text-xl font-bold mb-3" style={{ color: '#1a1a2e' }}>
                E-Mail unterwegs
              </h1>
              <p className="text-sm mb-6" style={{ color: '#718096', lineHeight: 1.6 }}>
                Wir haben Dir einen Link geschickt, falls diese E-Mail bei uns registriert ist. Bitte prüfe auch Deinen Spam-Ordner.
              </p>
              <Link
                href="/login"
                className="inline-block text-sm font-semibold transition-colors"
                style={{ color: '#0f4c81' }}
              >
                ← Zurück zum Login
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-bold mb-1 text-center" style={{ color: '#1a1a2e' }}>
                Passwort zurücksetzen
              </h1>
              <p className="text-sm text-center mb-8" style={{ color: '#718096' }}>
                Gib Deine E-Mail-Adresse ein und wir schicken Dir einen Link.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#4a5568' }}>
                    E-Mail
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError('');
                    }}
                    placeholder="max@beispiel.de"
                    autoComplete="email"
                    style={emailError ? { ...inputStyle, border: '1.5px solid #f87171' } : inputStyle}
                  />
                  {emailError && <p className="text-red-400 text-xs mt-1">{emailError}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-2xl font-bold text-sm transition-opacity disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
                  style={{ background: 'linear-gradient(135deg, #0f4c81 0%, #1a7a5e 100%)', color: '#ffffff' }}
                >
                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
                      Wird gesendet…
                    </>
                  ) : (
                    'Link anfordern'
                  )}
                </button>
              </form>

              <p className="text-center text-sm mt-6" style={{ color: '#718096' }}>
                <Link href="/login" className="font-semibold transition-colors" style={{ color: '#0f4c81' }}>
                  ← Zurück zum Login
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
