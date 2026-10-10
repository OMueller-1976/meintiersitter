import { MetadataRoute } from 'next'
import { REGIONS } from '@/lib/regions'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://tiersitti.de'
  const stand = new Date('2026-10-10')

  const staticRoutes = [
    { url: base, priority: 1.0, freq: 'weekly' as const },
    { url: `${base}/ueber-uns`, priority: 0.4, freq: 'monthly' as const },
    { url: `${base}/spenden`, priority: 0.3, freq: 'monthly' as const },
    { url: `${base}/impressum`, priority: 0.2, freq: 'yearly' as const },
    { url: `${base}/datenschutz`, priority: 0.2, freq: 'yearly' as const },
    { url: `${base}/agb`, priority: 0.2, freq: 'yearly' as const },
  ]

  const regionRoutes = Object.keys(REGIONS).flatMap((slug) => [
    { url: `${base}/${slug}`, priority: 0.9, freq: 'daily' as const },
    { url: `${base}/${slug}/sitter`, priority: 0.8, freq: 'daily' as const },
    { url: `${base}/${slug}/anlaufstellen`, priority: 0.8, freq: 'monthly' as const },
    { url: `${base}/${slug}/ratgeber`, priority: 0.7, freq: 'monthly' as const },
    { url: `${base}/${slug}/ratgeber/wandern`, priority: 0.7, freq: 'monthly' as const },
    { url: `${base}/${slug}/ratgeber/hundestrand`, priority: 0.6, freq: 'monthly' as const },
    { url: `${base}/${slug}/ratgeber/hund-entlaufen`, priority: 0.7, freq: 'monthly' as const },
    { url: `${base}/${slug}/ratgeber/unterkuenfte`, priority: 0.6, freq: 'monthly' as const },
    { url: `${base}/${slug}/marktplatz`, priority: 0.6, freq: 'weekly' as const },
  ])

  return [...staticRoutes, ...regionRoutes].map(({ url, priority, freq }) => ({
    url,
    lastModified: stand,
    changeFrequency: freq,
    priority,
  }))
}
