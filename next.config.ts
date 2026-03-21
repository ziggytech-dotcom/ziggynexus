import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tabrmsrxtqnuwivgwggb.supabase.co',
      },
    ],
  },
}

export default nextConfig
