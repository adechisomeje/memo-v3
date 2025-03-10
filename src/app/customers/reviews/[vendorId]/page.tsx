'use client'
import * as React from 'react'
import { Star } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { queryKeys } from '@/lib/queries'
import { useQuery } from '@tanstack/react-query'
import { getVendorReviews } from '@/api/public'
import { useVendorStore } from '@/store/vendorStore'

const Reviews = () => {
  const vendorId = useVendorStore((state) => state.selectedVendorId)
  const vendorName = useVendorStore((state) => state.vendorName)
  const { data: vendorReviews } = useQuery({
    queryKey: [queryKeys.vendorReviews, vendorId],
    queryFn: () => {
      return vendorId ? getVendorReviews(vendorId) : null
    },
    enabled: !!vendorId,
    staleTime: 5 * 60 * 1000,
  })

  return (
    <div className='px-10'>
      <main className=''>
        <h1 className='mt-6 text-2xl font-medium'>Reviews</h1>
        <Card className='my-10 '>
          <CardHeader className='space-y-4'>
            <div className='flex items-center space-x-32'>
              <div className='flex items-center gap-4'>
                <Avatar className='h-12 w-12'>
                  <AvatarImage
                    src='/placeholder.svg?height=48&width=48'
                    alt='Ajasco Cakes'
                  />
                  <AvatarFallback>
                    {vendorName
                      ?.split(' ')
                      .map((word) => word[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className='text-xl font-semibold'>{vendorName}</h2>
                  <div className='flex items-center gap-1'>
                    <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                    <span className='font-medium'>
                      {vendorReviews?.stats.averageRating.toFixed(1)}
                    </span>
                    <span className='text-muted-foreground'>
                      ({vendorReviews?.stats.totalReviews})
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <Separator />
          </CardHeader>
          <CardContent className='space-y-6 p-3'>
            {vendorReviews?.reviews.map((review) => (
              <div key={review._id} className='space-y-6'>
                <div className='space-y-4'>
                  <div className=' max-w-[800px] p-5 rounded-xl border border-[#0000000D] bg-[#FFFBFA]'>
                    <div className='flex gap-3'>
                      <Avatar>
                        <AvatarImage
                          src={review.user.profilePicture}
                          alt={`${review.user.firstName} ${review.user.lastName}`}
                        />
                        <AvatarFallback>
                          {`${review.user.firstName[0]}${review.user.lastName[0]}`.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className='flex-1 space-y-2'>
                        <h3 className='font-semibold text-black'>
                          {`${review.user.firstName} ${review.user.lastName}`}
                        </h3>
                        <p className='text-sm'>{review.comment}</p>
                      </div>
                    </div>
                    <div className=' p-3 text-sm text-muted-foreground'>
                      <span>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {review.replies.map((reply) => (
                    <div key={reply._id} className='ml-12 flex gap-4'>
                      <div className='bg-[#FFFBFA] p-5 rounded-xl border border-[#0000000D] max-w-[400px]'>
                        <div className='flex gap-3'>
                          <Avatar>
                            <AvatarImage
                              src='/placeholder.svg?height=40&width=40'
                              alt={reply.user}
                            />
                            <AvatarFallback>{reply.user[0]}</AvatarFallback>
                          </Avatar>
                          <div className='flex-1 space-y-2'>
                            <h3 className='font-semibold'>{reply.user}</h3>
                            <p className='text-sm text-muted-foreground'>
                              {reply.comment}
                            </p>
                          </div>
                          <div className='text-sm text-muted-foreground'>
                            <span>
                              {new Date(reply.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Separator />
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default Reviews
