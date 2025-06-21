/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // hoặc cụ thể như 'example.com'
      },
    ],
  },
};

module.exports = nextConfig;
