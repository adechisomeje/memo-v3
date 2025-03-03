'use client'

import { useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { format } from 'date-fns'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { MoreHorizontal, Eye } from 'lucide-react'
import OrderTrackingModal from './order-tracking-dialog'
import { queryKeys } from '@/lib/queries'
import { getUserOrders } from '@/api/user'

export default function OrdersPageContent() {
  const { status } = useSession()
  const { data: ordersResponse, isLoading } = useQuery({
    queryKey: [queryKeys.userOrders],
    queryFn: () => getUserOrders(),
    enabled: status === 'authenticated',
    staleTime: 5 * 60 * 1000,
  })

  const searchParams = useSearchParams()
  const selectedOrderIndex = searchParams.get('orderIndex')

  const updateURL = useCallback((orderIndex: string | null) => {
    const url = new URL(window.location.href)
    if (orderIndex) {
      url.searchParams.set('orderIndex', orderIndex)
    } else {
      url.searchParams.delete('orderIndex')
    }
    window.history.pushState({}, '', url)
  }, [])

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy')
    } catch (error) {
      console.log(error)
      return dateString
    }
  }

  // Helper function to get status badge color
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <Badge className='bg-green-500'>Completed</Badge>
      case 'processing':
        return <Badge className='bg-blue-500'>Processing</Badge>
      case 'shipped':
        return <Badge className='bg-purple-500'>Shipped</Badge>
      case 'cancelled':
        return <Badge className='bg-red-500'>Cancelled</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (status === 'unauthenticated') {
    return (
      <div className='flex justify-center items-center min-h-[400px]'>
        Please sign in to view your orders
      </div>
    )
  }

  const orders = ordersResponse?.data.orders || []

  return (
    <div className='flex min-h-screen'>
      <main className='flex-1 p-8'>
        <div className='flex justify-between items-center mb-6'>
          <div>
            <h1 className='text-2xl font-bold'>My Account</h1>
            <h2 className='text-xl font-semibold mt-1'>My Orders</h2>
          </div>
          <div className='text-sm text-muted-foreground'>
            {ordersResponse?.data.pagination && (
              <span>
                Showing {orders.length} of{' '}
                {ordersResponse.data.pagination.totalCount} orders
              </span>
            )}
          </div>
        </div>

        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[50px]'>#</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Delivery Date</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className='h-4 w-4' />
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-3'>
                        <Skeleton className='h-8 w-8 rounded-full' />
                        <Skeleton className='h-4 w-24' />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className='h-4 w-32' />
                    </TableCell>
                    <TableCell>
                      <Skeleton className='h-4 w-16' />
                    </TableCell>
                    <TableCell>
                      <Skeleton className='h-4 w-24' />
                    </TableCell>
                    <TableCell>
                      <Skeleton className='h-6 w-20' />
                    </TableCell>
                    <TableCell>
                      <Skeleton className='h-4 w-24' />
                    </TableCell>
                    <TableCell className='text-right'>
                      <Skeleton className='h-8 w-8 ml-auto' />
                    </TableCell>
                  </TableRow>
                ))
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className='text-center py-6'>
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order, index) => (
                  <TableRow key={order._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <div className='flex items-center gap-3'>
                        <Avatar className='h-8 w-8'>
                          <AvatarImage
                            src={order.vendor.profilePicture}
                            alt={order.vendor.businessName}
                          />
                          <AvatarFallback>
                            {order.vendor.businessName
                              .substring(0, 2)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className='font-medium'>
                          {order.vendor.businessName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{order.product.name}</TableCell>
                    <TableCell>${order.amount.toFixed(2)}</TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>{formatDate(order.deliveryDate)}</TableCell>
                    <TableCell className='text-right'>
                      <Dialog
                        open={selectedOrderIndex === index.toString()}
                        onOpenChange={(open) => {
                          updateURL(open ? index.toString() : null)
                        }}
                      >
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' size='icon'>
                              <MoreHorizontal className='h-4 w-4' />
                              <span className='sr-only'>Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DialogTrigger asChild>
                              <DropdownMenuItem>
                                <Eye className='mr-2 h-4 w-4' />
                                View Timeline
                              </DropdownMenuItem>
                            </DialogTrigger>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <DialogContent>
                          <OrderTrackingModal index={index} />
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  )
}
