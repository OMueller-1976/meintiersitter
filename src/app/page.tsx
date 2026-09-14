export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { REGIONS, getRegionSlugByDbRegion } from '@/lib/regions'
import type { RegionSlug } from '@/lib/regions'

export const metadata = {
  title: 'Tiersitti – Tiersitter-Vermittlung in Deiner Region',
  description:
    'Tiersitti verbindet Tierhalter und Tiersitter in der Region. Wähle Deinen Landkreis und leg direkt los.',
}

export default async function Home() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('region')
      .eq('id', user.id)
      .single()

    if (profile?.region) {
      const { redirect } = await import('next/navigation')
      redirect(`/${getRegionSlugByDbRegion(profile.region)}`)
    }
  }

  const regionList = Object.entries(REGIONS) as [RegionSlug, (typeof REGIONS)[RegionSlug]][]

  return (
    <main className="min-h-screen bg-[#F0F5FB] px-6 py-16">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <div className="text-5xl mb-4">🐾</div>
        <h1 className="text-3xl md:text-4xl font-bold text-[#1E3249] mb-3">
          Willkommen bei Tiersitti
        </h1>
        <p className="text-[#4E779F] text-lg leading-relaxed max-w-xl mx-auto">
          Tiersitti verbindet Tierhalter und Tiersitter in Deiner Region — kostenlos,
          werbefrei und ehrenamtlich betrieben. Wähle Deinen Landkreis, um loszulegen.
        </p>
      </div>

      <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
        {regionList.map(([slug, cfg]) => (
          <Link
            key={slug}
            href={`/${slug}`}
            className="bg-white border border-[#C8D8EC] rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#2D6A4F] transition-all"
          >
            <div className="text-sm font-semibold text-[#7A9DBF] uppercase tracking-wide mb-1">
              {cfg.bundesland}
            </div>
            <div className="text-xl font-bold text-[#1E3249] mb-2">{cfg.name}</div>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#2D6A4F]">
              Zur Region {cfg.kurzname} →
            </span>
          </Link>
        ))}
      </div>

      <p className="max-w-3xl mx-auto text-center text-sm text-[#7A9DBF] mt-12">
        Deine Region ist noch nicht dabei?{' '}
        <a href="mailto:kontakt@tiersitti.de" className="underline hover:text-[#4E779F]">
          Schreib uns
        </a>{' '}
        — wir wachsen stetig weiter.
      </p>
    </main>
  )
}
