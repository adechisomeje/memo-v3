'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

const SuccessPage = () => {
  const router = useRouter()

  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      router.push('/customers/dashboard/orders')
    }, 3000)

    return () => clearTimeout(redirectTimer)
  }, [router])

  return (
    <div className='min-h-screen flex flex-col items-center justify-center '>
      <div className='text-center p-9 rounded-lg'>
        <CheckCircle
          size={50}
          className='text-green-500 text-7xl mb-6 mx-auto animate-bounce'
        />
        <h1 className='text-3xl font-bold text-primary mb-5'>
          Payment Successful!
        </h1>
        <p className='text-gray-600 max-w-96 mb-8'>
          Thank you for your payment. Your transaction has been completed
          successfully, to see your order timeline, please go to your dashboard.
          Redirecting you automatically...
        </p>
        <Link href='/customers/dashboard/orders'>
          <Button size='lg'> Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}

export default SuccessPage
