import { useState } from 'react'
import { Sidebar } from '../../components/sidebar'
import { Input } from '@/components/ui/input'
import { Eye, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AccountPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className='min-h-screen flex flex-col'>
      {/* Mobile Menu Toggle */}
      <div className='md:hidden p-4 bg-black shadow-sm flex justify-between items-center'>
        <h1 className='text-2xl font-medium'>My Account</h1>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className='p-2 bg-black rounded-md'
        >
          <Menu className='h-6 w-6' />
        </button>
      </div>

      <div className='flex-1 container mx-auto flex gap-8 py-8'>
        {/* Sidebar (Desktop and Mobile) */}
        <Sidebar
          isMobile={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className='flex-1'>
          <h1 className='hidden md:block text-3xl font-medium mb-8'>
            My Account
          </h1>

          <div className='bg-white rounded-lg p-6'>
            <h2 className='text-xl font-medium mb-6'>Account Overview</h2>

            <form className='space-y-6 max-w-xl'>
              <div>
                <label className='block text-sm font-medium text-[#474747] mb-2'>
                  Account Name
                </label>
                <Input
                  type='text'
                  placeholder='Ajanlekoko Mariam'
                  className='py-6 px-3'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-[#474747] mb-2'>
                  E-mail
                </label>
                <Input
                  type='email'
                  placeholder='Ajanlekokomotun@gmail.com'
                  className='py-6 px-3'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-[#474747] mb-2'>
                  Phone Number
                </label>
                <Input
                  type='tel'
                  placeholder='09038387621'
                  className='py-6 px-3'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-[#474747] mb-2'>
                  Password
                </label>
                <div className='relative'>
                  <Input
                    type='password'
                    placeholder='e.g lsila25@'
                    className='py-6 px-3'
                  />
                  <Eye className='absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
                </div>
              </div>

              <Button variant='outline' className='w-full'>
                Update
              </Button>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
