import React from 'react'

import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

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
          successfully.
        </p>
        <Link
          href='/customers/dashboard/orders'
          className='inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors'
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}

export default SuccessPage
