import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type Props = {
  href: string
  className?: string
}

export const Logo = ({ href, className }: Props) => {
  return (
    <Link href={href}>
      <Image
        src='/assets/memo.png'
        alt='Logo'
        width={163}
        height={48}
        className={cn(
          'cursor-pointer max-lg:h-[28px] max-lg:w-[95px]',
          className
        )}
      />
    </Link>
  )
}
