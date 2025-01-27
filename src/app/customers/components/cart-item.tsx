import Image from 'next/image'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'

interface CartItemProps {
  image: string
  title: string
  price: number
  onRemove: () => void
}

export function CartItem({ title, price, onRemove }: CartItemProps) {
  return (
    <div className='flex items-center gap-4 py-3'>
      <div className='relative w-16 h-16'>
        <Image
          src={'/assets/images/cake-sample.svg'}
          alt={title}
          fill
          className='object-cover rounded'
        />
      </div>
      <div className='flex-1'>
        <h4 className='font-medium text-sm'>{title}</h4>
        <p className='text-sm text-gray-500'>{formatPrice(price)}</p>
      </div>
      <Button onClick={onRemove} className='h-8 w-8'>
        <X className='h-4 w-4' />
      </Button>
    </div>
  )
}
