'use client'

import { motion, Variants } from 'framer-motion'
import { X } from 'lucide-react'
import Link from 'next/link'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { TNavItem } from '@/app/types'

type Props = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  mobileNavItems: TNavItem[]
}

const itemVariants: Variants | undefined = {
  open: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
  closed: {
    opacity: 0,
    y: 20,
    transition: { duration: 0.2 },
  },
}

export const MobileNav = ({ isOpen, setIsOpen, mobileNavItems }: Props) => {
  return (
    <motion.nav
      variants={{
        open: {
          clipPath: 'circle(141.4% at 100% 0)',
          transition: {
            type: 'spring',
            bounce: 0,
            duration: 0.7,
            delayChildren: 0.3,
            staggerChildren: 0.05,
          },
        },
        closed: {
          clipPath: 'circle(0.0% at 100% 0)',
          transition: {
            type: 'spring',
            bounce: 0,
            duration: 0.3,
          },
        },
      }}
      initial='closed'
      animate={isOpen ? 'open' : 'closed'}
      className='fixed inset-x-0 top-0 z-20 flex h-screen flex-col overflow-scroll bg-white px-6 pt-[92px] transition-transform lg:hidden'
    >
      <motion.button
        whileHover={{ rotate: [0, 90] }}
        className='absolute right-3 top-3 cursor-pointer lg:hidden'
        onClick={() => setIsOpen(false)}
      >
        <X className='size-6' />
      </motion.button>
      <motion.ul className='flex flex-col text-2xl font-medium text-gray-200'>
        {mobileNavItems.map((item) => {
          if (item.subItems) {
            return <SubNavItems key={item.href} item={item} />
          }

          return <NavItem key={item.href} name={item.label} link={item.href} />
        })}
      </motion.ul>
      <div className='my-8 px-[42px]'>
        <Link href={'/get-started'}>
          <Button className='h-[50px] w-full'>Get Started</Button>
        </Link>
      </div>
      <p className='mb-6 mt-auto w-full text-gray-300'>
        © 2024 YPMC Logistics. All rights reserved.
      </p>
    </motion.nav>
  )
}

type NavItemProps = {
  name: string
  link: string
  active?: boolean
}

function NavItem({ name, link, active }: NavItemProps) {
  return (
    <motion.li variants={itemVariants} className='border-b py-8'>
      <Link href={link} className={active ? 'text-primary' : ''}>
        {name}
      </Link>
    </motion.li>
  )
}

export const SubNavItems = ({ item }: { item: TNavItem }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div key={item.href} variants={itemVariants}>
      <button
        className='w-full border-b py-8 text-start'
        onClick={() => setIsOpen(!isOpen)}
      >
        {item.label}
      </button>
      <div
        className='flex-col pl-4 data-[state=open]:flex data-[state=closed]:hidden'
        data-state={isOpen ? 'open' : 'closed'}
      >
        {item.subItems?.map((subItem) => {
          return (
            <Link
              href={subItem.href}
              key={subItem.href}
              className='py-3.5 text-xl text-gray-300'
            >
              {subItem.label}
            </Link>
          )
        })}
      </div>
    </motion.div>
  )
}
