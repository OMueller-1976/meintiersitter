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
    await supabase.from('profiles').insert({
      id: user.id,
      role: meta.role ?? 'owner',
      full_name: meta.full_name ?? '',
      email: user.email ?? '',
      plz: meta.plz ?? '',
      ort: meta.ort ?? '',
      ortschaft: meta.ortschaft ?? null,
      phone: meta.phone ?? null,
    });

    if (meta.role === 'sitter') {
      await supabase.from('sitter_profiles').insert({ id: user.id });
    }
  }

  return NextResponse.redirect(new URL(next, request.url));
}
