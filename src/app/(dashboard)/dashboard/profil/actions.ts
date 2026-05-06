'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { ProfileUpdate, SitterProfileUpdate } from '@/types';

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

export async function updateProfile(data: ProfileUpdate): Promise<{ error?: string }> {
  const supabase = makeClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Nicht eingeloggt.' };

  const { error } = await supabase
    .from('profiles')
    .update(data)
    .eq('id', user.id);

  if (error) return { error: error.message };
  return {};
}

export async function updateSitterProfile(
  data: SitterProfileUpdate
): Promise<{ error?: string }> {
  const supabase = makeClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Nicht eingeloggt.' };

  const { error } = await supabase
    .from('sitter_profiles')
    .update(data)
    .eq('id', user.id);

  if (error) return { error: error.message };
  return {};
}

/**
 * uploadAvatar: File-Upload läuft client-seitig via Supabase Browser Client.
 * Pattern (in der Page-Component):
 *
 *   const supabase = createClient() // browser client
 *   const { data: { user } } = await supabase.auth.getUser()
 *   const path = `${user.id}/avatar.${ext}`
 *   const { data, error } = await supabase.storage
 *     .from('avatars')
 *     .upload(path, file, { upsert: true })
 *   const url = supabase.storage
 *     .from('avatars')
 *     .getPublicUrl(data!.path).data.publicUrl
 *   await updateProfile({ avatar_url: url })
 */
