import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactCompiler: true,
  env: {
    SERVER_URL: process.env.SERVER_URL,
    GOOGLE_RECAPTCHA_SITE_KEY: process.env.GOOGLE_RECAPTCHA_SITE_KEY
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.twcstorage.ru',
        port: '',
        pathname: '/**'
      }
    ]
  }
}

export default nextConfig
