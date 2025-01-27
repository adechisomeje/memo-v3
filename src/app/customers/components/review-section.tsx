'use client'

import * as React from 'react'
import { Star } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { FeedbackDialog } from './feedback-dialog'

export interface Review {
  id: string
  author: {
    name: string
    avatar: string
  }
  content: string
  timestamp: string
  likes: number
  replies: Reply[]
}

export interface Reply {
  id: string
  author: {
    name: string
    avatar: string
  }
  content: string
  timestamp: string
  likes: number
}

// Sample data - in a real app this would come from an API
const reviews: Review[] = [
  {
    id: '1',
    author: {
      name: 'Ademola',
      avatar: '/placeholder.svg?height=40&width=40',
    },
    content:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores minus veniam corporis. Velit tempore laborum fugiat ad repellendus qui quidem commodi. Quidem repellat inventore non a labore accusantium sapiente nam.',
    timestamp: '20/04/2024',
    likes: 0,
    replies: [
      {
        id: '1-reply-1',
        author: {
          name: 'Midea Cakes',
          avatar: '/placeholder.svg?height=40&width=40',
        },
        content: 'Check your dms',
        timestamp: '20/04/2024',
        likes: 0,
      },
    ],
  },
  {
    id: '2',
    author: {
      name: 'Kayode',
      avatar: '/placeholder.svg?height=40&width=40',
    },
    content:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores minus veniam corporis. Velit tempore laborum fugiat ad repellendus qui quidem commodi. Quidem repellat inventore non a labore accusantium sapiente nam.',
    timestamp: '20/04/2024',
    likes: 0,
    replies: [
      {
        id: '1-reply-1',
        author: {
          name: 'Midea Cakes',
          avatar: '/placeholder.svg?height=40&width=40',
        },
        content: 'Thankssss see you next time',
        timestamp: '20/04/2024',
        likes: 0,
      },
    ],
  },
  {
    id: '3',
    author: {
      name: 'Mariam',
      avatar: '/placeholder.svg?height=40&width=40',
    },
    content:
      'First timer in conducting biz in jinji and I Was impress bcs i Received my items within shortest time .Thump up to the Lady',
    timestamp: '20/04/2024',
    likes: 0,
    replies: [
      {
        id: '1-reply-1',
        author: {
          name: 'Midea Cakes',
          avatar: '/placeholder.svg?height=40&width=40',
        },
        content: 'Thank you for patronizing',
        timestamp: '20/04/2024',
        likes: 0,
      },
    ],
  },
]

export function ReviewSection() {
  const vendorName = 'Ajasco Cakes'
  return (
    <Card className='my-10 '>
      <CardHeader className='space-y-4'>
        <div className='flex items-center space-x-32'>
          <div className='flex items-center gap-4'>
            <Avatar className='h-12 w-12'>
              <AvatarImage
                src='/placeholder.svg?height=48&width=48'
                alt='Ajasco Cakes'
              />
              <AvatarFallback>AC</AvatarFallback>
            </Avatar>
            <div>
              <h2 className='text-xl font-semibold'>Ajasco Cakes</h2>
              <div className='flex items-center gap-1'>
                <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                <span className='font-medium'>4.9</span>
                <span className='text-muted-foreground'>(1k+)</span>
              </div>
            </div>
          </div>
          {/* <Button size='lg'>Leave Feedback</Button> */}
          <FeedbackDialog vendorName={vendorName} />
        </div>
        <Separator />
      </CardHeader>
      <CardContent className='space-y-6 p-3'>
        {reviews.map((review) => (
          <div key={review.id} className='space-y-6'>
            <div className='space-y-4'>
              <div className=' max-w-[800px] p-5 rounded-xl border border-[#0000000D] bg-[#FFFBFA]'>
                <div className='flex gap-3'>
                  <Avatar>
                    <AvatarImage
                      src={review.author.avatar}
                      alt={review.author.name}
                    />
                    <AvatarFallback>{review.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className='flex-1 space-y-2'>
                    <h3 className='font-semibold text-black'>
                      {review.author.name}
                    </h3>
                    <p className='text-sm'>{review.content}</p>
                  </div>
                </div>
                <div className=' p-3 text-sm text-muted-foreground'>
                  <span>{review.timestamp}</span>
                  {/* <Button variant='ghost' size='sm'>
                    Like
                  </Button>
                  <Button variant='ghost' size='sm'>
                    Reply
                  </Button> */}
                </div>
              </div>
              {review.replies.map((reply) => (
                <div key={reply.id} className='ml-12 flex gap-4'>
                  <div className='bg-[#FFFBFA] p-5 rounded-xl border border-[#0000000D] max-w-[400px]'>
                    <div className='flex gap-3'>
                      <Avatar>
                        <AvatarImage
                          src={reply.author.avatar}
                          alt={reply.author.name}
                        />
                        <AvatarFallback>{reply.author.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className='flex-1 space-y-2'>
                        <h3 className='font-semibold'>{reply.author.name}</h3>
                        <p className='text-sm text-muted-foreground'>
                          {reply.content}
                        </p>
                      </div>
                      <div className='text-sm text-muted-foreground'>
                        <span>{reply.timestamp}</span>
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
  )
}
