import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface DeliveryDetails {
  address: string
  date: string
  country: string
  state: string
  city: string
}

interface DeliveryDetailsState {
  deliveryDetails: DeliveryDetails | null
  setDeliveryDetails: (details: DeliveryDetails) => void
  resetDeliveryDetails: () => void
}

export const useDeliveryDetails = create<DeliveryDetailsState>()(
  persist(
    (set) => ({
      deliveryDetails: null,
      setDeliveryDetails: (details) =>
        set(() => ({ deliveryDetails: details })),
      resetDeliveryDetails: () => set(() => ({ deliveryDetails: null })),
    }),
    {
      name: 'delivery-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
