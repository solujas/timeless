import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000']
    }
  },
  typescript: {
    ignoreBuildErrors: false
  }
};

export default nextConfig;
