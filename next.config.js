/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para Docker
  output: 'standalone',
  // Configuración para evitar problemas de ESM
  transpilePackages: ['@prisma/client'],
};

module.exports = nextConfig; 