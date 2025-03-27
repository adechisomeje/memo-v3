import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'memo-v3-vendor.vercel.app', 'images.unsplash.com', 'example.com'], // Add any other image domains you need
  },
}

export default nextConfig