import * as z from 'zod'

export const cakeCustomizationSchema = z.object({
  flavour: z.string({
    required_error: 'Please select a flavour',
  }),
  size: z.string({
    required_error: 'Please select a size',
  }),
  layers: z.string({
    required_error: 'Please select number of layers',
  }),
  icing: z.string({
    required_error: 'Please select an icing type',
  }),
})

export type CakeCustomizationSchema = z.infer<typeof cakeCustomizationSchema>
