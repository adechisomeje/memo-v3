'use client'

import OrderCheck from '../../../../public/assets/icons/order-check'

export default function OrderTrackingModal() {
  return (
    <div className='pt-4'>
      <h2 className='font-medium mb-6'>Delivery Date</h2>
      <p className='text-lg font-semibold mb-8'>5th Dec, 2024.</p>

      <div className='space-y-8'>
        <div className='flex gap-4'>
          <div className='relative'>
            <div className='flex h-6 w-6 items-center justify-center rounded-full '>
              <OrderCheck />
            </div>
            <div className='absolute top-8 bottom-0 left-3 w-px bg-gray-200' />
          </div>
          <div>
            <h3 className='font-medium'>Request Approval</h3>
            <p className='text-xs text-[#656565]'>
              Vendor accepted your request
            </p>
          </div>
        </div>

        <div className='flex gap-4'>
          <div className='relative'>
            <div className='flex h-6 w-6 items-center justify-center rounded-full bg-green-100'>
              <OrderCheck />
            </div>
            <div className='absolute top-8 bottom-0 left-3 w-px bg-gray-200' />
          </div>
          <div>
            <h3 className='font-medium'>Preparing Your Order</h3>
            <p className='text-xs text-[#656565]'>
              Vendor starts preparing order
            </p>
          </div>
        </div>

        <div className='flex gap-4'>
          <div className='relative'>
            <div className='flex h-6 w-6 items-center justify-center rounded-full bg-green-100'>
              <OrderCheck />
            </div>
            <div className='absolute top-8 bottom-0 left-3 w-px bg-gray-200' />
          </div>
          <div>
            <h3 className='font-medium'>Order Ready</h3>
            <p className='text-xs text-[#656565]'>Vendor completes order</p>
          </div>
        </div>

        <div className='flex gap-4'>
          <div className='relative'>
            <div className='flex h-6 w-6 items-center justify-center rounded-full bg-green-100'>
              <OrderCheck />
            </div>
            <div className='absolute top-8 bottom-0 left-3 w-px bg-gray-200' />
          </div>
          <div>
            <h3 className='font-medium'>Order Delivery</h3>
            <p className='text-xs text-[#656565]'>
              Vendor sends out order for delivery
            </p>
          </div>
        </div>

        <div className='flex gap-4'>
          <div>
            <div className='flex h-6 w-6 items-center justify-center rounded-full bg-green-100'>
              <OrderCheck />
            </div>
          </div>
          <div>
            <h3 className='font-medium'>Order Delivered</h3>
            <p className='text-xs text-[#656565]'>Recipient received order</p>
          </div>
        </div>
      </div>
    </div>
  )
}
