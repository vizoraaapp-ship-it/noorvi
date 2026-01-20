/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'tyxmwjounzpftvcrsrie.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'static-assets-web.flixcart.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/wishlist',
        destination: '/account/wishlist',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
