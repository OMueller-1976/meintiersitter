'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { TierProfileInsert, TierProfileUpdate } from '@/types';

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

export async function createTierProfile(
  data: Omit<TierProfileInsert, 'owner_id'>
): Promise<{ error?: string }> {
  const supabase = makeClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Nicht eingeloggt.' };

  const { error } = await supabase.from('tier_profiles').insert({
    ...data,
    owner_id: user.id,
  });

  if (error) return { error: error.message };
  return {};
}

export async function updateTierProfile(
  id: string,
  data: TierProfileUpdate
): Promise<{ error?: string }> {
  const supabase = makeClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Nicht eingeloggt.' };

  // WHERE id + owner_id = auth user for safety
  const { error } = await supabase
    .from('tier_profiles')
    .update(data)
    .eq('id', id)
    .eq('owner_id', user.id);

  if (error) return { error: error.message };
  return {};
}

export async function deleteTierProfile(id: string): Promise<{ error?: string }> {
  const supabase = makeClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Nicht eingeloggt.' };

  const { error } = await supabase
    .from('tier_profiles')
    .delete()
    .eq('id', id)
    .eq('owner_id', user.id);

  if (error) return { error: error.message };
  return {};
}

/**
 * uploadTierFoto: File-Upload läuft client-seitig via Supabase Browser Client.
 * Pattern (in der Page-Component):
 *
 *   const supabase = createClient() // browser client
 *   const path = `${userId}/${Date.now()}.${ext}`
 *   const { data, error } = await supabase.storage
 *     .from('tier-fotos')
 *     .upload(path, file, { upsert: true })
 *   const url = supabase.storage
 *     .from('tier-fotos')
 *     .getPublicUrl(data!.path).data.publicUrl
 *
 * Danach foto_url an createTierProfile() / updateTierProfile() übergeben.
 */
