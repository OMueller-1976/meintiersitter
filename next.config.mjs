/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/marktplatz',   destination: '/daun/marktplatz',   permanent: true },
      { source: '/wanderrouten', destination: '/daun/wanderrouten', permanent: true },
      { source: '/anlaufstellen',destination: '/daun/anlaufstellen',permanent: true },
      { source: '/hundestrand',  destination: '/daun/hundestrand',  permanent: true },
      { source: '/unterkunfte',  destination: '/daun/unterkunfte',  permanent: true },
      { source: '/ratgeber',     destination: '/daun/ratgeber',     permanent: true },
      { source: '/foerderer',    destination: '/daun/foerderer',    permanent: true },
    ];
  },
};

export default nextConfig;
