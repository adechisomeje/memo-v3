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
import { Google } from '../../../../public/assets/icons/Google'

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
        toast.error('Invalid Credentials')
        return
      }

      if (res?.ok) {
        toast.success('Logged in successfully')
        router.push('/')
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

            <Button
              disabled={loading}
              className='w-full'
              variant='default'
              type='submit'
            >
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
