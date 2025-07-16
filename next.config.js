/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Ensure p5.js works properly
  webpack: (config) => {
    config.externals = [...config.externals, { canvas: 'canvas' }]
    return config
  },
  // Performance optimizations
  images: {
    domains: [],
    formats: ['image/avif', 'image/webp'],
  },
  // Disable CSS optimization to avoid critters error
  experimental: {
    optimizeCss: false,
  },
}

module.exports = nextConfig