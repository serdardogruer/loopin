/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/admin',
  reactStrictMode: true,
  transpilePackages: ['@loopin/ui', '@loopin/types', '@loopin/validation', '@loopin/utils'],
};

module.exports = nextConfig;
