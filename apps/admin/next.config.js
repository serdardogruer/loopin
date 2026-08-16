/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@loopin/ui', '@loopin/types', '@loopin/validation', '@loopin/utils'],
};

module.exports = nextConfig;
