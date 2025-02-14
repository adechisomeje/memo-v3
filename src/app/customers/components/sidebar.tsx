'use client'

import Link from 'next/link'
import {
  User,
  ShoppingBag,
  Mail,
  LogOut,
  Pencil,
  X,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { signOut } from 'next-auth/react'

interface SidebarProps {
  isMobile: boolean
  onClose: () => void
}

export function Sidebar({ isMobile, onClose }: SidebarProps) {
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const pathname = usePathname()
  const menuItems = [
    {
      href: '/customers/dashboard/profile',
      icon: User,
      label: 'My Profile',
    },
    {
      href: '/customers/dashboard/orders',
      icon: ShoppingBag,
      label: 'My Orders',
    },
    {
      href: '/customers/dashboard/messages',
      icon: Mail,
      label: 'Messages',
    },
    // { href: '/', icon: LogOut, label: 'Log Out' },
  ]

  return (
    <div
      className={`
        ${
          isMobile
            ? 'fixed inset-0 z-50 bg-white overflow-y-auto'
            : 'w-64 min-h-screen bg-white hidden md:block'
        }
      `}
    >
      {isMobile && (
        <button onClick={onClose} className='absolute top-4 right-4 z-60'>
          <X className='h-6 w-6' />
        </button>
      )}

      <div className='p-6 bg-[#1d1d1d] text-center'>
        <div className='relative w-24 h-24 mx-auto mb-4'>
          <Avatar className='w-full h-full border-4 border-white'>
            <AvatarImage src='/placeholder.svg' />
            <AvatarFallback>MA</AvatarFallback>
          </Avatar>
          <label
            htmlFor='avatar-upload'
            className='absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-100'
          >
            <Pencil className='h-4 w-4 text-gray-600' />
            <input
              type='file'
              id='avatar-upload'
              className='hidden'
              accept='image/*'
            />
          </label>
        </div>
        <h2 className='text-white text-lg font-medium'>Welcome MARIAM</h2>
      </div>

      <nav className='p-4'>
        {menuItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center space-x-2 p-3 rounded-lg mb-2 ${
              pathname === href
                ? 'bg-[#ffeae4] text-primary'
                : 'text-[#474747] hover:bg-gray-100'
            } ${href === '/logout' ? 'text-primary' : ''}`}
            onClick={isMobile ? onClose : undefined}
          >
            <Icon className='h-5 w-5' />
            <span>{label}</span>
          </Link>
        ))}

        <Button
          variant='outline'
          className='border-none shadow-none'
          onClick={async () => {
            setLoading(true)
            const data = await signOut({
              redirect: false,
              callbackUrl: '/',
            })
            setLoading(false)
            console.log(loading)

            if (data.url) {
              router.push(data.url)
            }
          }}
        >
          <LogOut className='text-primary' />
          Log Out
        </Button>
      </nav>
    </div>
  )
}
