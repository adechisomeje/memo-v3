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
// import { validateName, validatePhone } from '@/lib/utils'

const schema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phoneNumber: z.string().optional(),
})

export type EditProfileValues = z.infer<typeof schema>

export default function ProfilePage() {
  // const { data: session, status } = useSession()
  const form = useForm<EditProfileValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
    },
  })

  // const getUserDetailsQuery = useQuery({
  //   queryKey: ['userProfile'],
  //   queryFn: getUserProfile,
  //   enabled: status === 'authenticated' && !!session?.accessToken,
  //   retry: 1,
  // })

  // if (status === 'loading') {
  //   return <div>Loading session...</div>
  // }

  // if (status !== 'authenticated' || !session) {
  //   return <div>Please sign in to view your profile</div>
  // }
  // console.log(getUserDetailsQuery.data?.data)

  return (
    <div className='flex min-h-screen b'>
      <div className='flex-1'>
        <main className='px-8 py-8 md:ml-64'>
          <h1 className='hidden md:block text-3xl font-medium mb-8'>
            My Account
          </h1>

          <div className='bg-white p-8 shadow-sm'>
            <h2 className='text-xl font-medium mb-6'>Account Overview</h2>

            <Form {...form}>
              <form className='space-y-6'>
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
