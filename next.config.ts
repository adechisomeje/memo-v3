import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com', 'example.com'], // Add any other image domains you need
  },
}

export default nextConfig