/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para Docker
  output: 'standalone',
  // Configuración para evitar problemas de ESM
  transpilePackages: ['@prisma/client'],
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig; 