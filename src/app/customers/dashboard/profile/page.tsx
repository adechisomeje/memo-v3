'use client'
import * as z from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateUserProfile } from '@/api/user'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { validateName, validatePhone } from '@/lib/utils'

const schema = z.object({
  firstName: z
    .string()
    .optional()
    .refine((value) => !value || validateName(value), {
      message: 'First Name must contain only alphabets',
    }),
  lastName: z
    .string()
    .optional()
    .refine((value) => !value || validateName(value), {
      message: 'Last Name must contain only alphabets',
    }),
  phoneNumber: z
    .string()
    .optional()
    .refine((value) => !value || validatePhone(value), {
      message: 'First Name must contain only alphabets',
    }),
})

export type EditProfileValues = z.infer<typeof schema>

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const form = useForm<EditProfileValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: session?.user?.firstName || '',
      lastName: session?.user?.lastName || '',
      phoneNumber: session?.user?.phone || '',
    },
  })

  console.log(status)

  const mutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      toast.success('User Profile Updated Successfully')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
  function onSubmit(values: z.infer<typeof schema>) {
    mutation.mutate({
      firstName: values.firstName || '',
      lastName: values.lastName || '',
      phone: values.phoneNumber || '',
    })
  }

  return (
    <div className='flex min-h-screen'>
      <div className='flex-1'>
        <main className='px-8 py-8 md:ml-64'>
          <h1 className='hidden md:block text-3xl font-medium mb-8'>
            My Account
          </h1>

          <div className='bg-white p-8 shadow-sm'>
            <h2 className='text-xl font-medium mb-6'>Account Overview</h2>

            <Form {...form}>
              <form
                className='space-y-6'
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <div className='grid grid-cols-2 gap-3'>
                  <FormField
                    control={form.control}
                    name='firstName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} className='py-6' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='lastName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} className='py-6' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name='phoneNumber'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input {...field} type='tel' className='py-6' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button variant='outline' className='w-full py-6'>
                  {mutation.isPending && (
                    <div className='h-4 w-4 animate-spinner rounded-full border-2 border-t-2 border-t-white ease-linear'></div>
                  )}
                  Update
                </Button>
              </form>
            </Form>
          </div>
        </main>
      </div>
    </div>
  )
}
