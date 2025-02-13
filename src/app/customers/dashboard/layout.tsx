'use client'
import { useState } from 'react'
import { Footer } from '../../../components/Footer/footer'
import { Sidebar } from '../components/sidebar'

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
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
