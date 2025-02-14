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
import { Google } from '../../../../public/assets/icons/Google'

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
          <Google />
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
                      <Input
                        className='h-12'
                        placeholder='First Name'
                        {...field}
                      />
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
                      <Input
                        className='h-12'
                        placeholder='Last Name'
                        {...field}
                      />
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
                    <Input
                      className='h-12'
                      placeholder='Email Address'
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
                  <FormLabel className='sr-only'>Phone Number</FormLabel>
                  <FormControl>
                    <Input className='h-12' placeholder='+234..' {...field} />
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
                    <Input
                      className='h-12'
                      placeholder='Password'
                      type='password'
                      {...field}
                    />
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
                      className='h-12'
                      placeholder='Confirm Password'
                      type='password'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={loading}
              className='w-full'
              variant='default'
              type='submit'
            >
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
