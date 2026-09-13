/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  distDir: process.env.NODE_ENV === 'development' ? '.next_dev' : '.next',
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
