import Link from 'next/link'
import { Sidebar } from '../../components/sidebar'

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
    orderNumber: '11286399',
  },
  {
    vendor: 'Midae Cake and Pastry',
    date: '4th Nov, 2024',
    time: '10:37',
    orderNumber: '11286399',
  },
  {
    vendor: 'Midae Cake and Pastry',
    date: '4th Nov, 2024',
    time: '10:37',
    orderNumber: '11286399',
  },
  {
    vendor: 'Midae Cake and Pastry',
    date: '4th Nov, 2024',
    time: '10:37',
    orderNumber: '11286399',
  },
]

export default function OrdersPage() {
  return (
    <div className='min-h-screen flex flex-col'>
      <div className='flex-1 container mx-auto flex gap-8 py-8'>
        <Sidebar />

        <main className='flex-1'>
          <h1 className='text-3xl font-medium mb-8'>My Account</h1>

          <div className='bg-white rounded-lg p-6'>
            <h2 className='text-xl font-medium mb-6'>My Orders</h2>

            <div className='space-y-4'>
              {orders.map((order, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between py-4 border-b last:border-b-0'
                >
                  <div>
                    <h3 className='font-medium text-[#370e06]'>
                      {order.vendor}
                    </h3>
                    <p className='text-sm text-[#474747] mt-1'>
                      {order.date}, {order.time}
                    </p>
                  </div>
                  <div className='text-right'>
                    <p className='text-sm text-[#474747]'>
                      Order {order.orderNumber}
                    </p>
                    <Link
                      href={`/orders/${order.orderNumber}/timeline`}
                      className='text-sm text-[#c1121f] hover:underline mt-1 inline-block'
                    >
                      View Timeline
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
