'use client'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters long',
  }),
})

export type SignInFormValues = z.infer<typeof schema>

const SignInForm = () => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: SignInFormValues) {
    setLoading(true)
    try {
      const res = await signIn('signIn', {
        ...values,
        redirect: false,
      })

      if (res?.error) {
        toast.error(res.error)
        return
      }

      if (res?.ok) {
        toast.success('Logged in successfully')
        router.push('/customers/dashboard/profile')
        router.refresh()
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='space-y-6'>
      {/* Social Login Buttons */}
      <div className='flex justify-center items-center'>
        <Button variant='outline' className='border-input'>
          <svg
            width='32'
            height='32'
            viewBox='0 0 32 32'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              opacity='0.7'
              d='M16.2072 8.39187C18.0197 8.36119 19.7712 9.04657 21.0815 10.2993L24.7382 6.64257C22.4312 4.47364 19.3734 3.28316 16.2072 3.3212C13.8433 3.3208 11.5259 3.97757 9.51371 5.21814C7.50154 6.45872 5.87387 8.23426 4.8125 10.3464L9.07227 13.6487C9.56217 12.1362 10.5141 10.8155 11.794 9.87247C13.074 8.92944 14.6175 8.41161 16.2072 8.39187Z'
              fill='#D34718'
            />
            <path
              d='M4.80908 10.3438C3.91744 12.1204 3.45313 14.0807 3.45312 16.0685C3.45313 18.0563 3.91744 20.0166 4.80908 21.7932L9.06885 18.491C8.53454 16.9202 8.53454 15.2168 9.06885 13.646L4.80908 10.3438Z'
              fill='#D34718'
            />
            <path
              opacity='0.5'
              d='M20.5309 22.5314C19.5451 23.1642 18.4279 23.5634 17.2643 23.6988C16.1008 23.8341 14.9218 23.7019 13.8171 23.3123C12.7124 22.9227 11.7113 22.2859 10.8902 21.4506C10.069 20.6152 9.44947 19.6034 9.07881 18.4922L4.82031 21.7944C5.88149 23.9062 7.50876 25.6815 9.52044 26.9221C11.5321 28.1626 13.849 28.8196 16.2124 28.8197C19.3161 28.9034 22.3345 27.7983 24.6504 25.7304L20.5309 22.5314Z'
              fill='#D34718'
            />
            <path
              opacity='0.25'
              d='M28.2111 13.75H16.2031V18.6817H23.0652C22.9231 19.4618 22.6244 20.205 22.187 20.8664C21.7495 21.5278 21.1826 22.0936 20.5203 22.5297L24.6411 25.7299C25.8961 24.5215 26.8831 23.0628 27.5381 21.4484C28.1931 19.834 28.5015 18.0999 28.4431 16.3586C28.4431 15.4814 28.3658 14.6119 28.2111 13.75Z'
              fill='#D34718'
            />
          </svg>
          Google
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

            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-2'>
                <Checkbox id='remember' />
                <label htmlFor='remember' className='text-sm text-[#656565]'>
                  Remember me
                </label>
              </div>
              <Link href='#' className='text-sm text-primary'>
                Forgot Password?
              </Link>
            </div>

            <Button className='w-full' variant='default' type='submit'>
              {loading ? 'Loading...' : 'Login'}
            </Button>
          </form>
        </Form>
      </div>

      <p className='text-center text-sm text-[#656565]'>
        Don&apos;t have an account?{' '}
        <Link href='#' className='text-primary'>
          Create an account
        </Link>
      </p>
    </div>
  )
}

export default SignInForm
