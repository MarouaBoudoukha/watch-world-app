/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force Next.js to transpile the problematic package
  transpilePackages: ['@worldcoin/mini-apps-ui-kit-react'],
  experimental: {
    esmExternals: false,
  },
};

module.exports = nextConfig;
