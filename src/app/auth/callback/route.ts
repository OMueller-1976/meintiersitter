import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (!code) {
    return NextResponse.redirect(
      new URL('/login?error=email_confirmation_failed', request.url)
    );
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  // 1. PKCE: Code gegen Session tauschen → setzt Auth-Cookie
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(
      new URL('/login?error=email_confirmation_failed', request.url)
    );
  }

  const user = data.user;
  const meta = user.user_metadata ?? {};
  const role = (meta.role as string) ?? 'tierhalter';

  // Parse JSON-Strings aus user_metadata (wurden als strings gespeichert)
  let sitterData: Record<string, unknown> = {};
  let tierData: Record<string, unknown> = {};
  try { if (meta.sitter_data) sitterData = JSON.parse(meta.sitter_data as string); } catch { /* ignore */ }
  try { if (meta.tier_data)   tierData   = JSON.parse(meta.tier_data as string);   } catch { /* ignore */ }

  // 2. onboarding_complete bestimmen
  const sitterComplete =
    (role === 'sitter' || role === 'beide') &&
    !!(sitterData.bio) &&
    !!(sitterData.bietet_gassi || sitterData.bietet_fuettern ||
       sitterData.bietet_tagesbetreuung || sitterData.bietet_uebernachtung);
  const tierComplete =
    (role === 'tierhalter' || role === 'beide') &&
    !!(tierData.tier_name) &&
    !!(tierData.tierart);
  const onboardingComplete =
    role === 'sitter'     ? sitterComplete :
    role === 'tierhalter' ? tierComplete :
    sitterComplete || tierComplete; // beide: mindestens eine Seite vollständig

  // 3. Profil vervollständigen per UPDATE — Trigger hat Zeile bereits angelegt
  await supabase.from('profiles').update({
    phone: (meta.phone as string) ?? null,
    plz: (meta.plz as string) ?? null,
    ort: (meta.ort as string) ?? null,
    ortschaft: (meta.ortschaft as string) ?? null,
    bio: (sitterData.bio as string) ?? null,
    onboarding_complete: onboardingComplete,
  }).eq('id', user.id);

  // 4. Sitter-Profil per UPSERT (1:1 zu profiles)
  if (role === 'sitter' || role === 'beide') {
    await supabase.from('sitter_profiles').upsert({
      id: user.id,
      erfahrung_jahre:      (sitterData.erfahrung_jahre as number)      ?? 0,
      hat_eigene_tiere:     (sitterData.hat_eigene_tiere as boolean)     ?? false,
      hat_garten:           (sitterData.hat_garten as boolean)           ?? false,
      kann_medikamente:     (sitterData.kann_medikamente as boolean)     ?? false,
      betreut_hunde:        (sitterData.betreut_hunde as boolean)        ?? true,
      betreut_katzen:       (sitterData.betreut_katzen as boolean)       ?? false,
      betreut_kleintiere:   (sitterData.betreut_kleintiere as boolean)   ?? false,
      bietet_gassi:         (sitterData.bietet_gassi as boolean)         ?? true,
      bietet_fuettern:      (sitterData.bietet_fuettern as boolean)      ?? true,
      bietet_uebernachtung: (sitterData.bietet_uebernachtung as boolean) ?? false,
      bietet_tagesbetreuung:(sitterData.bietet_tagesbetreuung as boolean)?? false,
      radius_km:            (sitterData.radius_km as number)             ?? 10,
      notfall_verfuegbar:   (sitterData.notfall_verfuegbar as boolean)   ?? false,
      notfall_telefon:      (sitterData.notfall_telefon as string)       ?? null,
      notfall_per_email:    (sitterData.notfall_per_email as boolean)    ?? true,
      notfall_per_sms:      (sitterData.notfall_per_sms as boolean)      ?? false,
      notfall_per_whatsapp: (sitterData.notfall_per_whatsapp as boolean) ?? false,
    }, { onConflict: 'id' });
  }

  // 5. Tier-Profil per INSERT (mehrere Tiere pro Tierhalter möglich)
  if ((role === 'tierhalter' || role === 'beide') && tierData.tier_name) {
    await supabase.from('tier_profiles').insert({
      owner_id:            user.id,
      name:                tierData.tier_name as string,
      tierart:             (tierData.tierart as string)            ?? 'sonstiges',
      rasse:               (tierData.rasse as string)              ?? null,
      alter_jahre:         (tierData.alter_jahre as number)        ?? null,
      vertraeglich_hunde:  (tierData.vertraeglich_hunde as boolean)?? true,
      vertraeglich_katzen: (tierData.vertraeglich_katzen as boolean)?? true,
      vertraeglich_kinder: (tierData.vertraeglich_kinder as boolean)?? true,
      besonderheiten:      (tierData.besonderheiten as string)     ?? null,
      is_active:           true,
      foto_urls:           [],
    });
  }

  return NextResponse.redirect(new URL(next, request.url));
}
