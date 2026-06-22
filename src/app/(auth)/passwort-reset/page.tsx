'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { createBrowserClient } from '@supabase/ssr';

export default function PasswortResetPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true);
      }
    });
    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function validate(): boolean {
    const newErrors: typeof errors = {};
    if (!newPassword) {
      newErrors.password = 'Bitte gib ein neues Passwort ein.';
    } else if (newPassword.length < 8) {
      newErrors.password = 'Das Passwort muss mindestens 8 Zeichen lang sein.';
    }
    if (!confirmPassword) {
      newErrors.confirm = 'Bitte bestätige Dein Passwort.';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirm = 'Die Passwörter stimmen nicht überein.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast.error('Passwort konnte nicht gesetzt werden. Bitte fordere einen neuen Link an.');
      setIsLoading(false);
    } else {
      toast.success('Passwort erfolgreich geändert!');
      router.push('/dashboard');
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
          {!ready ? (
            <div className="text-center py-4">
              <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm" style={{ color: '#718096' }}>
                Link wird überprüft…
              </p>
              <p className="text-xs mt-4" style={{ color: '#a0aec0' }}>
                Kam kein Link an?{' '}
                <Link href="/passwort-vergessen" style={{ color: '#0f4c81' }}>
                  Neuen anfordern
                </Link>
              </p>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-bold mb-1 text-center" style={{ color: '#1a1a2e' }}>
                Neues Passwort setzen
              </h1>
              <p className="text-sm text-center mb-8" style={{ color: '#718096' }}>
                Wähle ein sicheres Passwort mit mindestens 8 Zeichen.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Neues Passwort */}
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#4a5568' }}>
                    Neues Passwort
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                      }}
                      placeholder="Mind. 8 Zeichen"
                      autoComplete="new-password"
                      style={errors.password ? { ...inputStyle, border: '1.5px solid #f87171', paddingRight: 80 } : { ...inputStyle, paddingRight: 80 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
                      style={{ color: '#718096' }}
                    >
                      {showPassword ? 'Verbergen' : 'Zeigen'}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                </div>

                {/* Passwort bestätigen */}
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#4a5568' }}>
                    Passwort bestätigen
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirm) setErrors((prev) => ({ ...prev, confirm: undefined }));
                    }}
                    placeholder="Passwort wiederholen"
                    autoComplete="new-password"
                    style={errors.confirm ? { ...inputStyle, border: '1.5px solid #f87171' } : inputStyle}
                  />
                  {errors.confirm && <p className="text-red-400 text-xs mt-1">{errors.confirm}</p>}
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
                      Wird gespeichert…
                    </>
                  ) : (
                    'Passwort speichern'
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
