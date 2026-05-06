'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
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
}

export async function registerAction(
  data: RegisterData
): Promise<{ error: string } | undefined> {
  const cookieStore = cookies();

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

  // 1. Auth: sign up
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: { full_name: data.full_name, role: data.role },
    },
  });

  if (authError) return { error: authError.message };
  if (!authData.user) return { error: 'Registrierung fehlgeschlagen. Bitte erneut versuchen.' };

  // 2. Insert profile
  const { error: profileError } = await supabase.from('profiles').insert({
    id: authData.user.id,
    role: data.role,
    full_name: data.full_name,
    email: data.email,
    plz: data.plz,
    ort: data.ort,
    ortschaft: data.ortschaft || null,
    phone: data.phone || null,
  });

  if (profileError) {
    return { error: 'Profil konnte nicht erstellt werden: ' + profileError.message };
  }

  // 3. If sitter → insert sitter_profile with defaults
  if (data.role === 'sitter') {
    const { error: sitterError } = await supabase
      .from('sitter_profiles')
      .insert({ id: authData.user.id });

    if (sitterError) {
      return { error: 'Sitter-Profil konnte nicht erstellt werden.' };
    }
  }

  redirect('/dashboard');
}
