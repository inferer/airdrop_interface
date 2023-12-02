/** @type {import('next').NextConfig} */

const path = require('path')

const isDev = process.env.NODE_ENV === 'development'
// const isDev = true
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    scrollRestoration: true,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  async rewrites() {
    return [
      {
        source: '/api/identity/:path*',
        // destination: `https://api8.inferer.xyz/api/identity/:path*`
        destination: isDev ? `http://49.234.51.249:13882/api/identity/:path*` : `https://api8.inferer.xyz/api/identity/:path*`
      },
      {
        source: '/api/trends/:path*',
        // destination: `http://49.234.51.249:8792/api/:path*`
        destination: isDev ? `http://49.234.51.249:8792/api/trends/:path*` : `https://api7.inferer.xyz/api/trends/:path*`
      },
      {
        source: '/plugin/:path*',
        destination: isDev ? `http://49.234.51.249:8792/plugin/:path*` : `https://api7.inferer.xyz/plugin/:path*`
      },
    ]
  },
}

// http://49.234.51.249:8792

module.exports = nextConfig
