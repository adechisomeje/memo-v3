import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import Link from 'next/link'

import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  className?: string
  items: { label: string; href: string }[]
  title: string
}

export const NavbarHoverCard = ({ items, title, className }: Props) => {
  return (
    <HoverCard openDelay={300}>
      <HoverCardTrigger asChild className='group'>
        <button className={cn('text-gray-400', className)}>
          <div className='flex items-center justify-between gap-2'>
            <span className=' font-medium group-hover:text-primary'>
              {title}
            </span>
            <ChevronDown className='transition-all group-hover:text-primary group-data-[state=open]:rotate-180' />
          </div>
        </button>
      </HoverCardTrigger>
      <HoverCardContent className='w-[193px] rounded-[8px] p-0'>
        <div className='flex flex-col'>
          {items.map((item, index) => {
            return (
              <Link
                href={item.href}
                key={index}
                className='px-4 py-3.5 font-medium text-[#2E3036] hover:text-primary dark:text-slate-50 dark:hover:text-slate-200'
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
