import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import GesucheCarousel from '@/components/portal/GesucheCarousel';
import SitterCarousel from '@/components/portal/SitterCarousel';
import MatchKacheln from '@/components/portal/MatchKacheln';
import type { Profile } from '@/types';

export default async function DaunPortalPage() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: Profile | null = null;
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single<Profile>();
    profile = data;
  }

  const vorname = profile?.full_name?.split(' ')[0] ?? '';

  return (
    <div className="flex flex-col gap-5">
      {/* Begrüßungs-Header */}
      <div>
        <h1 className="text-xl font-semibold text-[#1E3249]">
          {user && vorname
            ? `Guten Tag, ${vorname}! 🐾`
            : 'Willkommen bei MeinTiersitter 🐾'}
        </h1>
        <p className="text-sm text-[#4E779F] mt-0.5">
          {user
            ? 'Hier ist was heute in der Vulkaneifel los ist.'
            : 'Finde oder werde ein Tiersitter im Kreis Daun.'}
        </p>
      </div>

      {/* Match-Kacheln */}
      <MatchKacheln isLoggedIn={!!user} userRole={profile?.role} />

      {/* Gesuche Carousel */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-[#C8D8EC] p-4">
        <GesucheCarousel />
      </div>

      {/* Sitter Carousel */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-[#C8D8EC] p-4">
        <SitterCarousel />
      </div>
    </div>
  );
}
