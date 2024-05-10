/** @type {import('next').NextConfig} */
const path = require('path')
const removeImports = require('next-remove-imports')();

const envConfig = {
  development: {
    NEXT_PUBLIC_CHAIN_ID: '421614',
    NEXT_PUBLIC_NETWORK_URL: 'http://125.88.184.105:8545',
    NEXT_PUBLIC_API_ROOT: 'http://36.26.92.165:13884',
    USER_POOL_SERVICE_ROOT: 'http://125.88.184.105:8123',
    NEXT_PUBLIC_USER_POOL_SERVICE_ROOT: "http://1.94.21.99:13884"
  },
  production: {
    NEXT_PUBLIC_CHAIN_ID: '1337',
    NEXT_PUBLIC_NETWORK_URL: 'https://node.inferer.xyz',
    NEXT_PUBLIC_API_ROOT: 'https://api10.inferer.xyz',
    USER_POOL_SERVICE_ROOT: 'http://125.88.184.105:8123',
    NEXT_PUBLIC_USER_POOL_SERVICE_ROOT: "http://1.94.21.99:13884"
  }
}

const isDev = process.env.NODE_ENV === 'development'
// next.config.js
const isProduction = process.env.NODE_ENV === 'production';
 
// const isDev = true
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    scrollRestoration: true,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  env: {
    BUILD_ENV: process.env.NODE_ENV || 'development',
    ...envConfig[process.env.NODE_ENV]
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
      {
        source: '/api/admerkle/:path*',
        // destination: `https://api8.inferer.xyz/api/identity/:path*`
        destination: isDev ? `http://125.88.184.105:8123/api/admerkle/:path*` : `http://125.88.184.105:8123/api/admerkle/:path*`
      },
    ]
  },
}

// http://49.234.51.249:8792

module.exports = removeImports(nextConfig)
