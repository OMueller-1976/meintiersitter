'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { UserRole } from '@/types';

export interface RegisterData {
  role: UserRole;
  full_name: string;
  email: string;
  password: string;
  plz: string;
  ort: string;
  ortschaft?: string;
  phone?: string;
  sitter_data?: string; // JSON-serialisierte Sitter-Details
  tier_data?: string;   // JSON-serialisierte Tier-Details
}

export async function registerAction(
  data: RegisterData,
  region: string = 'vulkaneifel'
): Promise<{ error: string } | { success: true; email: string } | undefined> {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from Server Component – ignore
          }
        },
      },
    }
  );

  // 1. Auth: sign up — profile is created in /auth/callback after email confirmation
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      data: {
        full_name: data.full_name,
        role: data.role,
        plz: data.plz,
        ort: data.ort,
        ortschaft: data.ortschaft || null,
        phone: data.phone || null,
        region,
        sitter_data: data.sitter_data || null,
        tier_data: data.tier_data || null,
      },
    },
  });

  if (authError) return { error: authError.message };
  if (!authData.user) return { error: 'Registrierung fehlgeschlagen. Bitte erneut versuchen.' };

  // Supabase gibt bei bereits bestätigter E-Mail keinen Error zurück (Sicherheitsverhalten),
  // aber identities ist leer — so erkennen wir stille Doppel-Registrierungen.
  if (authData.user.identities && authData.user.identities.length === 0) {
    return {
      error: 'Diese E-Mail-Adresse ist bereits registriert. Bitte melde Dich an oder setze Dein Passwort zurück, falls Du es vergessen hast.',
    };
  }

  return { success: true, email: data.email };
}
