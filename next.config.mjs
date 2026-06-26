/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Legacy Top-Level → Daun (bestehende URLs)
      { source: '/marktplatz',    destination: '/daun/marktplatz',           permanent: true },
      { source: '/wanderrouten',  destination: '/daun/ratgeber/wandern',     permanent: true },
      { source: '/anlaufstellen', destination: '/daun/anlaufstellen',        permanent: true },
      { source: '/hundestrand',   destination: '/daun/ratgeber/hundestrand', permanent: true },
      { source: '/unterkunfte',   destination: '/daun/ratgeber/unterkuenfte',permanent: true },
      { source: '/ratgeber',      destination: '/daun/ratgeber',             permanent: true },
      { source: '/foerderer',     destination: '/daun/foerderer',            permanent: true },

      // Region-Kurzlinks → echte Routen
      { source: '/:region/wanderrouten', destination: '/:region/ratgeber/wandern',      permanent: false },
      { source: '/:region/hundestrand',  destination: '/:region/ratgeber/hundestrand',  permanent: false },
      { source: '/:region/pinnwand',     destination: '/:region',                       permanent: false },
    ];
  },
};

export default nextConfig;
