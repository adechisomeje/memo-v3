'use client'

import { Star } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { z } from 'zod'
import { useEffect, useState } from 'react'
import { dropReviews } from '@/api/user'
import { useMutation } from '@tanstack/react-query'

export const feedbackSchema = z.object({
  rating: z.number().min(1, 'Please provide a rating').max(5),
  comment: z.string(),
})

export type FeedbackInput = z.infer<typeof feedbackSchema>

interface FeedbackDialogProps {
  vendorName: string
  orderId: string
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function FeedbackDialog({
  vendorName,
  orderId,
  isOpen,
  onOpenChange,
}: FeedbackDialogProps) {
  // Use internal state if external control props are not provided
  const [internalOpen, setInternalOpen] = useState(false)

  // Determine if we're using external or internal state control
  const open = isOpen !== undefined ? isOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen

  const form = useForm<FeedbackInput>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      rating: 0,
      comment: '',
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        rating: 0,
        comment: '',
      })
    }
  }, [open, form])

  const mutation = useMutation({
    mutationFn: dropReviews,
    onSuccess: () => {
      toast.success('Feedback submitted successfully')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
  function onSubmit(values: z.infer<typeof feedbackSchema>) {
    mutation.mutate({
      orderId,
      rating: values.rating,
      comment: values.comment,
    })
  }

  // console.log(orderId)

  const handleStarClick = (rating: number) => {
    form.setValue('rating', rating)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-center text-xl'>
            Leave feedback for {vendorName}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-6 mt-5'
          >
            <div className='space-y-2 bg-[#FFFBFA] p-3'>
              <p className='text-center'>How was your experience?</p>
              <div className='flex justify-center gap-1'>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type='button'
                    onClick={() => handleStarClick(star)}
                    className='focus:outline-none'
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= form.watch('rating')
                          ? 'fill-[#FFCE31] text-[#FFCE31]'
                          : 'fill-white'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {form.watch('rating') > 0 && (
                <p className='text-center text-lg font-medium'>
                  {form.watch('rating')}.0
                </p>
              )}
              <p className='text-center text-sm text-muted-foreground'>
                Rating
              </p>
            </div>

            <FormField
              control={form.control}
              name='comment'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder='Any remarks...'
                      className='min-h-[100px]'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex items-center justify-center'>
              <Button size='lg' type='submit'>
                {mutation.isPending ? (
                  <div className='flex items-center justify-center'>
                    <span className='animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full'></span>
                  </div>
                ) : (
                  <>Send Feedback</>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
