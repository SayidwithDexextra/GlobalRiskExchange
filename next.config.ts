import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/whitepaper.html", destination: "/whitepaper", permanent: true },
      { source: "/about.html", destination: "/team", permanent: true },
      { source: "/team.html", destination: "/team", permanent: true },
      { source: "/contact.html", destination: "/contact", permanent: true },
      { source: "/security.html", destination: "/", permanent: true },
      { source: "/markets.html", destination: "https://dexetera.xyz/explore", permanent: true },
      { source: "/dexetera-waitlist", destination: "/", permanent: true },
      { source: "/dexetera-waitlist/:path*", destination: "/", permanent: true },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
