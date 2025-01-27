'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface ReviewButtonProps {
  vendorId: string
  reviewCount: number
}

export function ReviewButton({ vendorId, reviewCount }: ReviewButtonProps) {
  return (
    <Button variant='outline' className='w-full p-6 gap-32'>
      {reviewCount} Reviews
      <Link className='underline' href={`/customers/reviews/${vendorId}`}>
        View all
      </Link>
    </Button>
  )
}
