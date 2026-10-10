export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { REGIONS, getRegionSlugByDbRegion } from '@/lib/regions'
import type { RegionSlug } from '@/lib/regions'
import PlzRegionFinder from '@/components/shared/PlzRegionFinder'
import LegalFooter from '@/components/shared/LegalFooter'
import JsonLd from '@/components/shared/JsonLd'
import { websiteLd } from '@/lib/seo'

export const metadata = {
  title: { absolute: 'Tiersitti – Tiersitter finden in Rheinland-Pfalz & NRW' },
  description:
    'Tiersitter, Hundesitter und Tierhilfe in Rheinland-Pfalz und NRW: Region wählen oder PLZ eingeben, Tierheime, Wanderwege und Ratgeber für Tierhalter.',
  alternates: { canonical: 'https://tiersitti.de' },
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
  const bundeslaender = Array.from(new Set(regionList.map(([, cfg]) => cfg.bundesland)))

  return (
    <main className="min-h-screen bg-[#F0F5FB] px-6 py-16">
      <JsonLd data={websiteLd} />
      <div className="max-w-3xl mx-auto text-center mb-12">
        <div className="text-5xl mb-4">🐾</div>
        <h1 className="text-3xl md:text-4xl font-bold text-[#1E3249] mb-3">
          Willkommen bei Tiersitti
        </h1>
        <p className="text-[#4E779F] text-lg leading-relaxed max-w-xl mx-auto">
          Tiersitti verbindet Tierhalter und Tiersitter in Deiner Region — kostenlos,
          werbefrei und ehrenamtlich betrieben. Gib Deine PLZ ein oder wähle Deine Region, um loszulegen.
        </p>
      </div>

      <PlzRegionFinder />

      {bundeslaender.map((bl) => (
        <section key={bl} className="max-w-3xl mx-auto mb-8" aria-labelledby={`bl-${bl}`}>
          <h2 id={`bl-${bl}`} className="text-sm font-semibold text-[#7A9DBF] uppercase tracking-wide mb-3">
            {bl}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {regionList
              .filter(([, cfg]) => cfg.bundesland === bl)
              .map(([slug, cfg]) => (
                <Link
                  key={slug}
                  href={`/${slug}`}
                  className="bg-white border border-[#C8D8EC] rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#2D6A4F] transition-all"
                >
                  <div className="text-xl font-bold text-[#1E3249] mb-2">{cfg.name}</div>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#2D6A4F]">
                    Zur Region {cfg.kurzname} →
                  </span>
                </Link>
              ))}
          </div>
        </section>
      ))}

      <p className="max-w-3xl mx-auto text-center text-sm text-[#7A9DBF] mt-12">
        Deine Region ist noch nicht dabei?{' '}
        <a href="mailto:kontakt@tiersitti.de" className="underline hover:text-[#4E779F]">
          Schreib uns
        </a>{' '}
        — wir wachsen stetig weiter.
      </p>
      <LegalFooter className="mt-4" />
    </main>
  )
}
