'use client'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { validateName, validatePassword, validatePhone } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

const schema = z
  .object({
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
    password: z
      .string()
      .min(8, {
        message: 'Password must be at least 8 characters',
      })
      .refine(validatePassword, {
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.',
      }),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ['passwordConfirm'],
  })

export type SignUpFormValues = z.infer<typeof schema>

const SignUpForm = () => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      passwordConfirm: '',
    },
  })

  async function onSubmit(values: SignUpFormValues) {
    setLoading(true)

    const res = await signIn('signUp', {
      ...values,
      redirect: false,
    })

    if (!res?.ok) {
      toast.error(res?.error || 'Something went wrong')
      setLoading(false)
    } else {
      router.push('/customers/dashboard/profile')
    }
  }

  return (
    <div className='space-y-6'>
      {/* Social Login Buttons */}
      <div className='flex justify-center items-center'>
        <Button variant='outline' className='border-input'>
          <svg
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M8.35909 0.789921C5.96112 1.6218 3.89311 3.20073 2.45882 5.2948C1.02454 7.38887 0.299573 9.88769 0.390418 12.4242C0.481264 14.9608 1.38313 17.4013 2.96355 19.3874C4.54396 21.3735 6.71962 22.8005 9.17096 23.4587C11.1583 23.9715 13.2405 23.994 15.2385 23.5243C17.0484 23.1177 18.7218 22.2481 20.0947 21.0005C21.5236 19.6624 22.5608 17.9602 23.0947 16.0768C23.6751 14.0287 23.7783 11.8748 23.3966 9.78055H12.2366V14.4099H18.6997C18.5705 15.1483 18.2937 15.853 17.8859 16.4819C17.478 17.1107 16.9474 17.6509 16.326 18.0699C15.5367 18.592 14.6471 18.9432 13.7141 19.1012C12.7784 19.2752 11.8186 19.2752 10.8828 19.1012C9.93444 18.9051 9.03727 18.5137 8.24846 17.9518C6.98124 17.0548 6.02973 15.7804 5.52971 14.3105C5.02124 12.8132 5.02124 11.1898 5.52971 9.69242C5.88564 8.64283 6.47403 7.68717 7.25096 6.8968C8.14007 5.9757 9.26571 5.31729 10.5044 4.99381C11.743 4.67034 13.0469 4.69429 14.2728 5.06305C15.2305 5.35703 16.1063 5.87068 16.8303 6.56305C17.5591 5.83805 18.2866 5.11117 19.0128 4.38242C19.3878 3.99055 19.7966 3.61742 20.166 3.21617C19.0608 2.18769 17.7635 1.3874 16.3485 0.861171C13.7717 -0.0744733 10.9522 -0.0996178 8.35909 0.789921Z'
              fill='white'
            />
            <path
              d='M8.35875 0.790832C10.9516 -0.0993112 13.7711 -0.0748285 16.3481 0.860207C17.7634 1.39001 19.0601 2.19415 20.1637 3.22646C19.7887 3.62771 19.3931 4.00271 19.0106 4.39271C18.2831 5.11896 17.5562 5.84271 16.83 6.56396C16.106 5.87159 15.2302 5.35794 14.2725 5.06396C13.047 4.69391 11.7432 4.66857 10.5042 4.99072C9.26516 5.31288 8.13883 5.97007 7.24875 6.89021C6.47181 7.68059 5.88342 8.63624 5.5275 9.68583L1.64062 6.67646C3.03189 3.91751 5.44078 1.80713 8.35875 0.790832Z'
              fill='#E33629'
            />
            <path
              d='M0.607495 9.65313C0.816409 8.61774 1.16325 7.61505 1.63874 6.67188L5.52562 9.68875C5.01715 11.1861 5.01715 12.8095 5.52562 14.3069C4.23062 15.3069 2.93499 16.3119 1.63874 17.3219C0.448402 14.9525 0.0853684 12.2528 0.607495 9.65313Z'
              fill='#F8BD00'
            />
            <path
              d='M12.2352 9.78125H23.3952C23.777 11.8755 23.6737 14.0294 23.0933 16.0775C22.5594 17.9609 21.5222 19.6631 20.0933 21.0012C18.839 20.0225 17.579 19.0513 16.3246 18.0725C16.9465 17.653 17.4773 17.1123 17.8852 16.4827C18.2931 15.8532 18.5696 15.1478 18.6983 14.4088H12.2352C12.2333 12.8675 12.2352 11.3244 12.2352 9.78125Z'
              fill='#587DBD'
            />
            <path
              d='M1.64062 17.3275C2.93687 16.3275 4.2325 15.3225 5.5275 14.3125C6.02851 15.7829 6.98138 17.0573 8.25 17.9537C9.04127 18.513 9.94037 18.9012 10.89 19.0937C11.8257 19.2677 12.7855 19.2677 13.7213 19.0937C14.6542 18.9358 15.5439 18.5846 16.3331 18.0625C17.5875 19.0412 18.8475 20.0125 20.1019 20.9913C18.7292 22.2395 17.0558 23.1098 15.2456 23.5169C13.2476 23.9866 11.1655 23.9641 9.17813 23.4512C7.60632 23.0316 6.13814 22.2917 4.86563 21.2781C3.51874 20.2088 2.41867 18.8612 1.64062 17.3275Z'
              fill='#319F43'
            />
          </svg>
          Continue with Google
        </Button>
      </div>

      <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t' />
        </div>
        <div className='relative flex justify-center text-sm'>
          <span className='px-2 bg-white text-[#656565]'>Or continue</span>
        </div>
      </div>

      {/* Login Form */}
      <div className='space-y-4'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='mt-8 space-y-6'
          >
            <div className='flex gap-4'>
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
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='sr-only'>Password</FormLabel>
                  <FormControl>
                    <Input placeholder='Password' type='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='passwordConfirm'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='sr-only'>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Confirm Password'
                      type='password'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className='w-full' variant='default' type='submit'>
              {loading ? 'Loading...' : 'Register'}
            </Button>
          </form>
        </Form>
      </div>

      <p className='text-center text-sm text-[#656565]'>
        Already have an account?{' '}
        <Link href='/sign-in' className='text-primary'>
          Log in
        </Link>
      </p>
    </div>
  )
}

export default SignUpForm
