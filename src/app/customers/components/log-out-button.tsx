'use client'

import { LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export default function LogoutButton() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger className='text-red-600' asChild>
          <LogOut />
          <p>Log Out</p>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to log out?</DialogTitle>
            <DialogDescription>
              This will log you out of your account and you will need to log
              back in to access your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              className='w-full'
              variant='destructive'
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>

            <Button
              className='w-full'
              type='submit'
              onClick={async () => {
                setLoading(true)
                const data = await signOut({
                  redirect: false,
                  callbackUrl: '/login',
                })
                setLoading(false)

                if (data.url) {
                  router.push(data.url)
                }
              }}
            >
              {loading ? 'Logging out...' : 'Log Out'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
