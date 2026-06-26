import { MetadataRoute } from 'next'
import { REGIONS } from '@/lib/regions'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://tiersitti.de'
  const now = new Date()

  const staticRoutes = [
    { url: `${base}/impressum`, priority: 0.3 },
    { url: `${base}/datenschutz`, priority: 0.3 },
  ]

  const regionRoutes = Object.keys(REGIONS).flatMap((slug) => [
    { url: `${base}/${slug}`, priority: 1.0 },
    { url: `${base}/${slug}/sitter`, priority: 0.9 },
    { url: `${base}/${slug}/marktplatz`, priority: 0.7 },
    { url: `${base}/${slug}/wanderrouten`, priority: 0.7 },
    { url: `${base}/${slug}/hundestrand`, priority: 0.7 },
    { url: `${base}/${slug}/anlaufstellen`, priority: 0.7 },
    { url: `${base}/${slug}/unterkunfte`, priority: 0.7 },
    { url: `${base}/${slug}/ratgeber`, priority: 0.7 },
  ])

  return [...staticRoutes, ...regionRoutes].map(({ url, priority }) => ({
    url,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority,
  }))
}
