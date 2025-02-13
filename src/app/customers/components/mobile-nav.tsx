'use client'
import { motion, Variants } from 'framer-motion'
import { X } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { TNavItem } from '@/types/nav-types'

type Props = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  mobileNavItems: TNavItem[]
}

const itemVariants: Variants = {
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
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <>
      {/* Add overlay */}
      {isOpen && (
        <div
          className='fixed inset-0 bg-black/50 z-40'
          onClick={() => setIsOpen(false)}
        />
      )}
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
        className='fixed inset-0 z-50 flex h-[100dvh] flex-col overflow-y-auto bg-white px-6 pt-[92px]'
      >
        <motion.button
          whileHover={{ rotate: 90 }}
          className='absolute right-6 top-6 cursor-pointer'
          onClick={() => setIsOpen(false)}
        >
          <X className='size-6' />
        </motion.button>
        <motion.ul className='flex flex-col text-2xl font-medium'>
          {mobileNavItems.map((item) => {
            if (item.subItems) {
              return <SubNavItems key={item.href} item={item} />
            }
            return (
              <NavItem key={item.href} name={item.label} link={item.href} />
            )
          })}
        </motion.ul>
        <div className='my-8 px-[42px]'>
          <Link href='/get-started'>
            <Button className='h-[50px] w-full'>Get Started</Button>
          </Link>
        </div>
        <p className='mb-6 mt-auto w-full text-gray-500'>
          © 2024 YPMC Logistics. All rights reserved.
        </p>
      </motion.nav>
    </>
  )
}

type NavItemProps = {
  name: string
  link: string
  active?: boolean
}

function NavItem({ name, link, active }: NavItemProps) {
  return (
    <motion.li
      variants={itemVariants}
      className='border-b border-gray-100 py-8'
    >
      <Link
        href={link}
        className={active ? 'text-primary' : 'text-gray-900 hover:text-primary'}
      >
        {name}
      </Link>
    </motion.li>
  )
}

export const SubNavItems = ({ item }: { item: TNavItem }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div variants={itemVariants}>
      <button
        className='w-full border-b border-gray-100 py-8 text-start text-gray-900 hover:text-primary'
        onClick={() => setIsOpen(!isOpen)}
      >
        {item.label}
      </button>
      <motion.div
        initial='collapsed'
        animate={isOpen ? 'open' : 'collapsed'}
        variants={{
          open: { opacity: 1, height: 'auto' },
          collapsed: { opacity: 0, height: 0 },
        }}
        transition={{ duration: 0.3 }}
        className='overflow-hidden pl-4'
      >
        {item.subItems?.map((subItem) => (
          <Link
            href={subItem.href}
            key={subItem.href}
            className='block py-3.5 text-xl text-gray-600 hover:text-primary'
          >
            {subItem.label}
          </Link>
        ))}
      </motion.div>
    </motion.div>
  )
}
