import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://tiersitti.de'
  const now = new Date()

  const routes = [
    { url: `${base}/daun`, priority: 1.0 },
    { url: `${base}/pinnwand`, priority: 0.9 },
    { url: `${base}/daun/sitter`, priority: 0.9 },
    { url: `${base}/ratgeber`, priority: 0.8 },
    { url: `${base}/ratgeber/wandern`, priority: 0.7 },
    { url: `${base}/ratgeber/hundestrand`, priority: 0.7 },
    { url: `${base}/ratgeber/unterkuenfte`, priority: 0.7 },
    { url: `${base}/anlaufstellen`, priority: 0.7 },
    { url: `${base}/marktplatz`, priority: 0.7 },
    { url: `${base}/foerderer`, priority: 0.5 },
    { url: `${base}/impressum`, priority: 0.3 },
    { url: `${base}/datenschutz`, priority: 0.3 },
    { url: `${base}/agb`, priority: 0.3 },
  ]

  return routes.map(({ url, priority }) => ({
    url,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority,
  }))
}
