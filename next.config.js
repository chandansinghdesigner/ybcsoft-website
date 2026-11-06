/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Old multi-page URLs keep working after the move to a single-page experience (SEO-safe 301s)
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/about.html", destination: "/#about", permanent: true },
      { source: "/services.html", destination: "/#services", permanent: true },
      { source: "/portfolio.html", destination: "/#portfolio", permanent: true },
      { source: "/contact.html", destination: "/#contact", permanent: true },
    ];
  },
  async headers() {
    return [
      { source: "/fonts/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/assets/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=604800" }] },
    ];
  },
};
module.exports = nextConfig;
