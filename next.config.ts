import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'covers.openlibrary.org',
      },
      {
        protocol: 'https',
        hostname: '8xiuaezpump81etp.public.blob.vercel-storage.com',
      }
    ],

  },
};

export default nextConfig;
