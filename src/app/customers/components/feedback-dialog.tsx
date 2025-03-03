'use client'

import * as React from 'react'
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

export const feedbackSchema = z.object({
  rating: z.number().min(1, 'Please provide a rating').max(5),
  remarks: z.string().min(1, 'Please provide your feedback').max(500),
})

export type FeedbackInput = z.infer<typeof feedbackSchema>

interface FeedbackDialogProps {
  vendorName: string
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function FeedbackDialog({
  vendorName,
  isOpen,
  onOpenChange,
}: FeedbackDialogProps) {
  // Use internal state if external control props are not provided
  const [internalOpen, setInternalOpen] = React.useState(false)

  // Determine if we're using external or internal state control
  const open = isOpen !== undefined ? isOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen

  const form = useForm<FeedbackInput>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      rating: 0,
      remarks: '',
    },
  })

  // Reset form when dialog opens
  React.useEffect(() => {
    if (open) {
      form.reset({
        rating: 0,
        remarks: '',
      })
    }
  }, [open, form])

  const onSubmit = async (data: FeedbackInput) => {
    try {
      // api goes in here
      console.log('Feedback submitted:', data)
      toast('Feedback submitted')
      setOpen(false)
      form.reset()
    } catch (error) {
      console.error('Error submitting feedback:', error)
      toast('Error occurred.')
    }
  }

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
              name='remarks'
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
                Send Feedback
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
