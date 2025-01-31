'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'

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

  return (
    <div
      className='relative group'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className='aspect-square relative overflow-hidden rounded-xl'>
        <Image
          src={'/assets/images/cake-sample.svg'}
          alt={title}
          width={300}
          height={300}
          className='object-cover w-full h-full'
        />
      </div>
      <div className='mt-2'>
        <h3 className='font-medium text-sm'>{title}</h3>
        <p className='text-sm text-gray-500'>{description}</p>
        <p className='font-semibold mt-1'>{formatPrice(price)}</p>
        {isHovered && (
          <Button
            onClick={() => onAdd({ image, title, description, price })}
            className='w-full bg-primary hover:bg-primary/90'
            size='icon'
          >
            Add
            <Plus className='h-5 w-5' />
          </Button>
        )}
      </div>
    </div>
  )
}
