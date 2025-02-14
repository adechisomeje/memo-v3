import { create } from 'zustand'

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

export const useDeliveryDetails = create<DeliveryDetailsState>((set) => ({
  deliveryDetails: null,
  setDeliveryDetails: (details) => set(() => ({ deliveryDetails: details })),
  resetDeliveryDetails: () => set(() => ({ deliveryDetails: null })),
}))
