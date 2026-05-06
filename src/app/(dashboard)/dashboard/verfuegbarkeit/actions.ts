'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { VerfuegbarkeitInsert } from '@/types';

function makeClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (list) => {
          try {
            list.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {}
        },
      },
    }
  );
}

export async function createVerfuegbarkeit(
  data: Omit<VerfuegbarkeitInsert, 'profile_id' | 'rolle'>
): Promise<{ error?: string }> {
  const supabase = makeClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Nicht eingeloggt.' };

  const { error } = await supabase.from('verfuegbarkeit').insert({
    ...data,
    profile_id: user.id,
    rolle: 'sitter',
  });

  if (error) return { error: error.message };
  return {};
}

export async function deleteVerfuegbarkeit(id: string): Promise<{ error?: string }> {
  const supabase = makeClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Nicht eingeloggt.' };

  const { error } = await supabase
    .from('verfuegbarkeit')
    .delete()
    .eq('id', id)
    .eq('profile_id', user.id);

  if (error) return { error: error.message };
  return {};
}
