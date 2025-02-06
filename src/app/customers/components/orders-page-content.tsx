'use client'

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import { Sidebar } from './sidebar'
import OrderTrackingModal from './order-tracking-dialog'

interface Order {
  vendor: string
  date: string
  time: string
  orderNumber: string
}

const orders: Order[] = [
  {
    vendor: 'Midae Cake and Pastry',
    date: '4th Nov, 2024',
    time: '10:37',
    orderNumber: '11286339',
  },
  {
    vendor: 'Midae Cake and Pastry',
    date: '4th Nov, 2024',
    time: '10:37',
    orderNumber: '11286390',
  },
  {
    vendor: 'Midae Cake and Pastry',
    date: '4th Nov, 2024',
    time: '10:37',
    orderNumber: '11286391',
  },
  {
    vendor: 'Midae Cake and Pastry',
    date: '4th Nov, 2024',
    time: '10:37',
    orderNumber: '11286399',
  },
]

export default function OrdersPageContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const searchParams = useSearchParams()
  const selectedOrder = searchParams.get('order')

  const updateURL = useCallback((orderNumber: string | null) => {
    const url = new URL(window.location.href)
    if (orderNumber) {
      url.searchParams.set('order', orderNumber)
    } else {
      url.searchParams.delete('order')
    }
    window.history.pushState({}, '', url)
  }, [])

  return (
    <div className='flex min-h-screen'>
      <Sidebar
        isMobile={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <main className='flex-1 p-8'>
        <h1 className='text-2xl font-bold mb-4'>My Account</h1>
        <h2 className='text-xl font-semibold mb-6'>My Orders</h2>
        <div className='space-y-4'>
          {orders.map((order, index) => (
            <div
              key={index}
              className='border rounded-lg p-4 flex justify-between items-center'
            >
              <div>
                <h3 className='font-medium'>{order.vendor}</h3>
                <p className='text-gray-600'>
                  {order.date}, {order.time}
                </p>
              </div>
              <div className='flex items-center gap-4'>
                <span className='text-gray-600'>Order {order.orderNumber}</span>
                <Dialog
                  open={selectedOrder === order.orderNumber}
                  onOpenChange={(open) => {
                    updateURL(open ? order.orderNumber : null)
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant='ghost'
                      className='hover:underline text-primary'
                    >
                      View Timeline
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <OrderTrackingModal />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
