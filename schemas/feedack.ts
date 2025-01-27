import { z } from 'zod'

export const feedbackSchema = z.object({
  rating: z.number().min(1, 'Please provide a rating').max(5),
  remarks: z.string().min(1, 'Please provide your feedback').max(500),
})

export type FeedbackInput = z.infer<typeof feedbackSchema>
