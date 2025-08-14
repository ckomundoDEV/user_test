/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para Docker
  output: 'standalone',
  // Configuración para evitar problemas de ESM
  transpilePackages: ['@prisma/client'],
  // Server Actions ya están habilitados por defecto en Next.js 14
};

module.exports = nextConfig;
