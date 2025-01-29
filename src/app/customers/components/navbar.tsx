'use client'

import React, { useState } from 'react'
import { TNavItem } from '../../types'
import { cn } from '@/lib/utils'
import { NavbarHoverCard } from './nav-hover-card'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Hamburger } from '@/components/icons/hamburger'
import { useMediaQuery } from 'usehooks-ts'
import { Dancing_Script } from 'next/font/google'
import { MobileNav } from './mobile-nav'

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  weight: ['700'],
  display: 'swap',
})

type Props = {
  mobileNavItems: TNavItem[]
  navItems: TNavItem[]
  ctaLink: string
  classNames?: Record<string, string>
}

const Navbar = ({ navItems, ctaLink, mobileNavItems, classNames }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const isMobile = useMediaQuery('(max-width: 1023px)')
  return (
    <nav className='py-6 px-8 border-b border-gray-200'>
      <div className=' flex  items-center justify-between'>
        <div className='text-3xl'>
          <Link className={dancingScript.className} href='/'>
            MEMO
          </Link>
        </div>
        <div className='hidden gap-[85px] lg:flex'>
          <ul className='flex items-center gap-8'>
            {navItems.map((item) => {
              if (item.subItems) {
                return (
                  <NavbarHoverCard
                    items={item.subItems}
                    key={item.href}
                    title={item.label}
                    className={cn(
                      pathname === item.href
                        ? ''
                        : 'text-[#370E06] hover:text-primary',
                      classNames?.navItem
                    )}
                  />
                )
              }
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'text-[#370E06] font-medium hover:text-primary',
                      pathname === item.href ? 'font-bold' : '',
                      classNames?.navItem
                      // isScrolled ? 'text-gray-400' : ''
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className='flex flex-row gap-4'>
            <div className='flex'>
              <div className='m-3'>
                <svg
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M16 15H8C5.79086 15 4 16.7909 4 19V21H12H20V19C20 16.7909 18.2091 15 16 15Z'
                    stroke='#474747'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z'
                    stroke='#474747'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </div>

              <div className='flex flex-col'>
                <p>Hello</p>
                <p className='font-bold'>SIGN IN</p>
              </div>
            </div>
            <Link href={ctaLink}>
              <Button size='lg'>Become A Vendor</Button>
            </Link>
          </div>
        </div>

        <button className='lg:hidden' onClick={() => setIsOpen(true)}>
          <Hamburger />
        </button>
        {isMobile && (
          <MobileNav
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            mobileNavItems={mobileNavItems}
          />
        )}
      </div>
    </nav>
  )
}

export default Navbar
