'use client'

import { Suspense } from 'react'
import OrdersPageContent from '../../components/orders-page-content'

export default function OrdersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrdersPageContent />
    </Suspense>
  )
}
