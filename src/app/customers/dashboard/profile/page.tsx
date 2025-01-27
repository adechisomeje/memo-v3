import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye } from 'lucide-react'
import { Sidebar } from '../../components/sidebar'

export default function AccountPage() {
  return (
    <div className='min-h-screen flex flex-col'>
      <div className='flex-1 container mx-auto flex gap-8 py-8'>
        <Sidebar />

        <main className='flex-1'>
          <h1 className='text-3xl font-medium mb-8'>My Account</h1>

          <div className='bg-white rounded-lg p-6'>
            <h2 className='text-xl font-medium mb-6'>Account Overview</h2>

            <form className='space-y-6 max-w-xl'>
              <div>
                <label className='block text-sm font-medium text-[#474747] mb-2'>
                  Account Name
                </label>
                <Input
                  type='text'
                  defaultValue='Ajanlekoko Mariam'
                  className='py-6 px-3'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-[#474747] mb-2'>
                  E-mail
                </label>
                <Input
                  type='email'
                  defaultValue='Ajanlekokomotun@gmail.com'
                  className='py-6 px-3'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-[#474747] mb-2'>
                  Phone Number
                </label>
                <Input
                  type='tel'
                  defaultValue='09038387621'
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
                    defaultValue='e.g lsila25@'
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
