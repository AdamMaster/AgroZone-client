import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactCompiler: true,
  env: {
    SERVER_URL: process.env.SERVER_URL
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com'
      },
      {
        protocol: 'https',
        hostname: 'avatars.yandex.net'
      }
    ]
  }
}

export default nextConfig
