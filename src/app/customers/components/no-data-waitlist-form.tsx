'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { productWaitlist } from '@/api/public'
import { useMutation } from '@tanstack/react-query'
import { useDeliveryDetails } from '@/store/deliveryDetails'
import { useSession } from 'next-auth/react'
import { Textarea } from '@/components/ui/textarea'

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().min(11, { message: 'Please enter a valid phone number' }),
  productType: z.string().min(1, { message: 'Please select a product type' }),
  notes: z.string().optional(),
})

export default function NoDataWithWaitlist() {
  const [open, setOpen] = useState(false)
  const { deliveryDetails } = useDeliveryDetails()
  const { data: session } = useSession()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      productType: '',
      notes: '',
    },
  })
  const mutation = useMutation({
    mutationFn: productWaitlist,
    onSuccess: () => {
      toast.success(
        'An Email will be sent to you when a Vendor is in your ends, thank you for using Memo!'
      )
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } }
    ) => {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('An error occurred. Please try again.')
      }
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!deliveryDetails) {
      toast.error('Delivery details not found')
      return
    }

    mutation.mutate({
      name: values.name,
      email: values.email,
      phone: values.phone,
      productType: values.productType,
      notes: values.notes ?? '',
      country: deliveryDetails.country,
      state: deliveryDetails.state,
      city: deliveryDetails.city,
      userId: session?.user?.id ?? '',
    })
    console.log(values)
    // Close the modal
    setOpen(false)

    // Reset the form
    form.reset()
  }

  return (
    <div className='col-span-4 flex flex-col justify-center items-center py-10 gap-3'>
      <Image
        src='/assets/icons/no-data.svg'
        alt='No results'
        width={300}
        height={300}
      />
      <p className='mt-8'>
        No cake products available. Please try again later.
      </p>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className='mt-4' variant='default'>
            Join Waitlist
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[500px]'>
          <DialogHeader>
            <DialogTitle>Memo Vendor Waitlist</DialogTitle>
            <DialogDescription>
              Get notified when vendors become available in your area.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter your name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter your email'
                        type='email'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter your phone number' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='productType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a product type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='cake'>Cake</SelectItem>
                        <SelectItem value='flower'>Flower</SelectItem>
                        <SelectItem value='gift'>Gift</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='notes'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea placeholder=' ' className='w-full' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='flex justify-end pt-2'>
                <Button type='submit'>
                  {mutation.isPending ? (
                    <div className='flex items-center justify-center'>
                      <span className='animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full'></span>
                    </div>
                  ) : (
                    <>Submit</>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
