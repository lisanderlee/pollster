import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [ 'https://picsum.photos/'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
