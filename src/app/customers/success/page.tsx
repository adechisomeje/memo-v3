import React from 'react'

import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

const SuccessPage = () => {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-50'>
      <div className='text-center p-8 rounded-lg'>
        <CheckCircle className='text-green-500 text-7xl mb-6 mx-auto animate-bounce' />
        <h1 className='text-3xl font-bold text-gray-800 mb-4'>
          Payment Successful!
        </h1>
        <p className='text-gray-600 mb-8'>
          Thank you for your payment. Your transaction has been completed
          successfully, to see your order timeline, please go to your dashboard
        </p>
        <Link href='/customers/dashboard/orders'>
          <Button size='lg'> Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}

export default SuccessPage
