import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  devIndicators: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [70, 80, 90],
  },
};

export default nextConfig;
