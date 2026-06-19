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
    await supabase.from('profiles').upsert({
      id: user.id,
      role: meta.role ?? 'tierhalter',
      full_name: meta.full_name ?? '',
      email: user.email ?? '',
      plz: meta.plz ?? null,
      ort: meta.ort ?? null,
      ortschaft: meta.ortschaft ?? null,
      phone: meta.phone ?? null,
      onboarding_complete: true,
    }, { onConflict: 'id' });

    if (meta.role === 'sitter' || meta.role === 'beide') {
      let sitterData: Record<string, unknown> = {};
      try {
        if (meta.sitter_data) sitterData = JSON.parse(meta.sitter_data);
      } catch { /* ignore parse errors */ }

      await supabase.from('sitter_profiles').upsert({
        id: user.id,
        ...sitterData,
      }, { onConflict: 'id' });
    }
  }

  return NextResponse.redirect(new URL(next, request.url));
}
