'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Plus } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { toast } from 'sonner'

interface ProductCardProps {
  image: string
  title: string
  description: string
  price: number
  onAdd: (product: {
    image: string
    title: string
    description: string
    price: number
  }) => void
}

export function ProductCard({
  image,
  title,
  description,
  price,
  onAdd,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleAdd = () => {
    onAdd({ image, title, description, price })
    toast.success(`${title} added to cart`)
  }
  // console.log(isHovered) // Remove or comment out if not needed

  return (
    <div
      className='relative group cursor-pointer transform transition-transform duration-200 hover:scale-105'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleAdd}
    >
      <div className='aspect-square relative overflow-hidden rounded-xl'>
        <Image
          src={image} // Use the image prop, not a hardcoded path
          alt={title}
          fill // Use fill for responsive images, remove width and height
          className='object-cover' // object-cover is usually sufficient
        />
        <div className='absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center'>
          <Plus className='text-white w-8 h-8' />
          {/* Removed extra span, added directly to the button */}
        </div>
      </div>
      <div className='mt-2'>
        <h3 className='font-medium text-sm'>{title}</h3>
        <p className='text-sm text-gray-500'>{description}</p>
        <p className='font-semibold mt-1'>{formatPrice(price)}</p>
      </div>
    </div>
  )
}
