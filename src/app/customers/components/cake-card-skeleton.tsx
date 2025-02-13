import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function CakeCardSkeleton() {
  return (
    <Card className='overflow-hidden'>
      <div className='aspect-[4/3] relative overflow-hidden'>
        <Skeleton className='w-full h-full' />
      </div>
      <CardContent className='p-4'>
        <div className='space-y-3'>
          <div className='space-y-1'>
            <div className='flex justify-between items-center'>
              <Skeleton className='h-4 w-16' />
              <Skeleton className='h-4 w-12' />
            </div>
            <div className='flex justify-between items-center'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-4 w-12' />
            </div>
            <div className='flex justify-between items-center pt-2 border-t'>
              <Skeleton className='h-4 w-16' />
              <Skeleton className='h-4 w-12' />
            </div>
          </div>
          <div className='flex items-center gap-3 pt-3 border-t'>
            <Skeleton className='h-8 w-8 rounded-full' />
            <div className='flex-1'>
              <Skeleton className='h-4 w-32' />
              <div className='flex items-center gap-1 mt-1'>
                <Skeleton className='h-4 w-20' />
                <Skeleton className='h-4 w-6' />
                <Skeleton className='h-4 w-10' />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
