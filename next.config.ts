import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        // hostname: 'wjpxthucjcqipvcuknyq.supabase.co',
        hostname: '**',
        // port: '',
        // pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
