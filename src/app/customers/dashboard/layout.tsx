'use client'
import { useState, useEffect } from 'react'
import { Footer } from '../../../components/Footer/footer'
import { Sidebar } from '../components/sidebar'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  // Show nothing while checking authentication
  if (status === 'loading') {
    return null
  }

  // Only render the dashboard if authenticated
  if (status === 'authenticated') {
    return (
      <div>
        <div className='flex-1 container mx-auto flex gap-8 py-8'>
          <Sidebar
            isMobile={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
          {children}
        </div>
        <Footer />
      </div>
    )
  }

  return null
}
