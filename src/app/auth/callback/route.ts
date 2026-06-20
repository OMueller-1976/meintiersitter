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

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(
      new URL('/login?error=email_confirmation_failed', request.url)
    );
  }

  const user = data.user;
  const meta = user.user_metadata ?? {};

  // Create profile if it doesn't exist yet
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single();

  if (!existingProfile) {
    // Parse optional onboarding payloads
    let sitterData: Record<string, unknown> = {};
    let tierData: Record<string, unknown> = {};
    try { if (meta.sitter_data) sitterData = JSON.parse(meta.sitter_data); } catch { /* ignore */ }
    try { if (meta.tier_data) tierData = JSON.parse(meta.tier_data); } catch { /* ignore */ }

    // Determine onboarding completeness per role
    const role = meta.role ?? 'tierhalter';
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
      role === 'sitter' ? sitterComplete :
      role === 'tierhalter' ? tierComplete :
      sitterComplete || tierComplete; // beide: mindestens eine Seite vollständig

    await supabase.from('profiles').upsert({
      id: user.id,
      role,
      full_name: meta.full_name ?? '',
      email: user.email ?? '',
      plz: meta.plz ?? null,
      ort: meta.ort ?? null,
      ortschaft: meta.ortschaft ?? null,
      phone: meta.phone ?? null,
      onboarding_complete: onboardingComplete,
    }, { onConflict: 'id' });

    if (role === 'sitter' || role === 'beide') {
      await supabase.from('sitter_profiles').upsert({
        id: user.id,
        bio: sitterData.bio ?? null,
        erfahrung_jahre: sitterData.erfahrung_jahre ?? 0,
        hat_eigene_tiere: sitterData.hat_eigene_tiere ?? false,
        hat_garten: sitterData.hat_garten ?? false,
        kann_medikamente: sitterData.kann_medikamente ?? false,
        betreut_hunde: sitterData.betreut_hunde ?? true,
        betreut_katzen: sitterData.betreut_katzen ?? true,
        betreut_kleintiere: sitterData.betreut_kleintiere ?? false,
        bietet_gassi: sitterData.bietet_gassi ?? true,
        bietet_fuettern: sitterData.bietet_fuettern ?? true,
        bietet_tagesbetreuung: sitterData.bietet_tagesbetreuung ?? false,
        bietet_uebernachtung: sitterData.bietet_uebernachtung ?? false,
        radius_km: sitterData.radius_km ?? 10,
        notfall_verfuegbar: sitterData.notfall_verfuegbar ?? false,
        notfall_telefon: sitterData.notfall_telefon ?? null,
        notfall_per_email: sitterData.notfall_per_email ?? true,
        notfall_per_sms: sitterData.notfall_per_sms ?? false,
        notfall_per_whatsapp: sitterData.notfall_per_whatsapp ?? false,
      }, { onConflict: 'id' });
    }

    if ((role === 'tierhalter' || role === 'beide') && tierData.tier_name) {
      await supabase.from('tier_profiles').insert({
        owner_id: user.id,
        name: tierData.tier_name,
        tierart: tierData.tierart ?? 'sonstiges',
        rasse: tierData.rasse ?? null,
        alter_jahre: tierData.alter_jahre ?? null,
        vertraeglich_hunde: tierData.vertraeglich_hunde ?? false,
        vertraeglich_katzen: tierData.vertraeglich_katzen ?? false,
        vertraeglich_kinder: tierData.vertraeglich_kinder ?? false,
        besonderheiten: tierData.besonderheiten ?? null,
        is_active: true,
      });
    }
  }

  return NextResponse.redirect(new URL(next, request.url));
}
