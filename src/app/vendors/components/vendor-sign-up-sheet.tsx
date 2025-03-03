import { UserCircle } from 'lucide-react'
import * as z from 'zod'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  validateBusiness,
  validateInstagramUsername,
  validateName,
  validatePhone,
} from '@/lib/utils'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

const schema = z.object({
  firstName: z
    .string()
    .min(2, {
      message: 'First Name must be at least 2 characters',
    })
    .refine(validateName, {
      message: 'First Name must contain only alphabets',
    }),
  lastName: z
    .string()
    .min(2, {
      message: 'Last Name must be at least 2 characters',
    })
    .refine(validateName, {
      message: 'Last Name must contain only alphabets',
    }),
  businessName: z
    .string()
    .min(2, {
      message: 'Business Name must be at least 2 characters',
    })
    .max(65, {
      message: 'Business Name cannot be longer than 65 characters long',
    })
    .refine(validateBusiness, {
      message: 'Business Name must contain only alphabets',
    }),

  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z
    .string()
    .min(11, {
      message: 'Phone Number must be at least 11 characters',
    })
    .max(11, {
      message: 'Phone Number must be 11 characters',
    })
    .refine(validatePhone, {
      message: 'Enter a valid phone number (e.g. 08034567890)',
    }),
  country: z.string().min(2, {
    message: 'Country must be at least 2 characters',
  }),
  instagramUsername: z
    .string()
    .min(2, {
      message: 'Business Name must be at least 2 characters',
    })
    .refine(validateInstagramUsername, {
      message: 'Invalid @',
    }),
  businessAddress: z.string().min(2, {
    message: 'Business Address must be at least 2 characters',
  }),
})

export type VendorDetails = z.infer<typeof schema>

const VendorSignUp = () => {
  const [loading, setLoading] = useState(false)
  console.log(setLoading)
  // const router = useRouter()
  const form = useForm<VendorDetails>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      country: '',
      businessName: '',
      instagramUsername: '',
      businessAddress: '',
    },
  })

  //   const vendorSignUpMutation = useMutation({
  //     mutationFn: vendorSignUp,
  //     onError: (error) => {
  //       toast.error(error.message ?? 'Something went wrong')
  //     },
  //     onSuccess: () => {
  //       router.push('/register/verify')
  //     },
  //   })
  return (
    <Sheet>
      <SheetTrigger>
        <div className='flex justify-center items-center gap-2'>
          <div className=''>
            <UserCircle />
          </div>

          <p className=''>Sign in</p>
        </div>
      </SheetTrigger>
      <SheetContent className='w-[400px] sm:w-[540px]'>
        <SheetHeader>
          <SheetTitle>Start selling with Memo</SheetTitle>
          <SheetDescription>
            Join our platform to sell smarter, earn more, and efficiently run
            your online business
          </SheetDescription>
        </SheetHeader>
        {/* Sign Up Form */}
        <Form {...form}>
          <form
            className='my-8 space-y-5'
            // onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className='grid grid-cols-2 gap-3'>
              <FormField
                control={form.control}
                name='firstName'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel className='sr-only'>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder='First Name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='lastName'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel className='sr-only'>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Last Name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='businessName'
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormLabel className='sr-only'>Business Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Business Name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='businessAddress'
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormLabel className='sr-only'>Business Address</FormLabel>
                  <FormControl>
                    <Input placeholder='Business Address' {...field} />
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
                  <FormLabel className='sr-only'>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder='Email Address' {...field} />
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
                  <FormLabel className='sr-only'>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder='+234..' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='instagramUsername'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='sr-only'>Instagram Handle</FormLabel>
                  <FormControl>
                    <Input placeholder='Instagram Handle' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='w-full' variant='default' type='submit'>
              {loading ? 'Loading...' : 'Continue'}
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}

export default VendorSignUp
