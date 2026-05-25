/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  transpilePackages: ['leaflet', 'react-leaflet'],
}

module.exports = nextConfig
