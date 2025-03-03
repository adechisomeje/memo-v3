'use client'
import { format } from 'date-fns'
import { useQuery } from '@tanstack/react-query'
import OrderCheck from '../../../../public/assets/icons/order-check'
import { Skeleton } from '@/components/ui/skeleton'
import { queryKeys } from '@/lib/queries'
import { getOrderTimeline } from '@/api/orders'
import { useSession } from 'next-auth/react'

// Define the status steps in order
const ORDER_STEPS = [
  {
    key: 'approved',
    label: 'Request Approval',
    description: 'Vendor accepted your request',
  },
  {
    key: 'preparing',
    label: 'Preparing Your Order',
    description: 'Vendor starts preparing order',
  },
  { key: 'ready', label: 'Order Ready', description: 'Vendor completes order' },
  {
    key: 'shipping',
    label: 'Order Delivery',
    description: 'Vendor sends out order for delivery',
  },
  {
    key: 'delivered',
    label: 'Order Delivered',
    description: 'Recipient received order',
  },
]

// Map API status to our step keys
const STATUS_MAP: Record<string, string> = {
  pending: 'approved',
  processing: 'preparing',
  completed: 'ready',
  shipped: 'shipping',
  delivered: 'delivered',
  // Add more mappings as needed
}

type OrderTrackingModalProps = {
  index: number
  orderId: string
}

export default function OrderTrackingModal({
  orderId,
}: OrderTrackingModalProps) {
  const { status } = useSession()
  const { data: timelineResponse, isLoading } = useQuery({
    queryKey: [queryKeys.orderTimeline, orderId],
    queryFn: () => getOrderTimeline(orderId),
    enabled: status === 'authenticated' && !!orderId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Get the latest status from timeline if available
  const currentStatus =
    timelineResponse?.data[
      timelineResponse?.data.length - 1
    ]?.action?.toLowerCase() || 'pending'
  const mappedStatus = STATUS_MAP[currentStatus] || 'approved'

  if (isLoading) {
    return (
      <div className='pt-4 space-y-4'>
        <Skeleton className='h-6 w-32' />
        <Skeleton className='h-8 w-48' />
        <div className='space-y-8 mt-8'>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className='flex gap-4'>
              <Skeleton className='h-6 w-6 rounded-full' />
              <div className='space-y-2'>
                <Skeleton className='h-5 w-40' />
                <Skeleton className='h-4 w-60' />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!timelineResponse?.data) {
    return <div className='pt-4'>Timeline not found</div>
  }

  // Get the latest timeline entry for the order ID
  // const latestEntry = timelineResponse.data[timelineResponse.data.length - 1]

  return (
    <div className='pt-4'>
      <h2 className='font-medium mb-2'>Order #{orderId.substring(0, 8)}</h2>
      <h3 className='font-medium mb-6'>Timeline</h3>

      <div className='space-y-8'>
        {ORDER_STEPS.map((step, stepIndex) => {
          // Determine if this step is completed based on current status
          const isCompleted = getStepStatus(step.key, mappedStatus)
          const isLast = stepIndex === ORDER_STEPS.length - 1

          // Find matching timeline entry for this step
          const timelineEntry = timelineResponse.data.find(
            (entry) => STATUS_MAP[entry.action.toLowerCase()] === step.key
          )

          return (
            <div key={step.key} className='flex gap-4'>
              <div className='relative'>
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full ${
                    isCompleted ? 'bg-green-100' : ''
                  }`}
                >
                  <OrderCheck />
                </div>
                {!isLast && (
                  <div className='absolute top-8 bottom-0 left-3 w-px bg-gray-200' />
                )}
              </div>
              <div>
                <h3 className='font-medium'>{step.label}</h3>
                <p className='text-xs text-[#656565]'>
                  {timelineEntry?.description || step.description}
                </p>
                {isCompleted && step.key === mappedStatus && (
                  <p className='text-xs text-green-600 mt-1'>
                    {timelineEntry?.timestamp
                      ? format(
                          new Date(timelineEntry.timestamp),
                          'MMM dd, yyyy HH:mm'
                        )
                      : 'Current status'}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Helper function to determine if a step is completed
function getStepStatus(stepKey: string, currentStatus: string): boolean {
  const stepIndex = ORDER_STEPS.findIndex((step) => step.key === stepKey)
  const currentIndex = ORDER_STEPS.findIndex(
    (step) => step.key === currentStatus
  )

  // If current step or any previous step, mark as completed
  return stepIndex <= currentIndex
}
