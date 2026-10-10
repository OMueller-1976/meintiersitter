import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/dashboard', '/chat', '/auth/', '/login', '/register', '/passwort-reset', '/passwort-vergessen'],
    },
    sitemap: 'https://tiersitti.de/sitemap.xml',
    host: 'https://tiersitti.de',
  }
}
