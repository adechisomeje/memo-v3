import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface VendorState {
  selectedVendorId: string | null
  vendorName: string | null
  vendorPicture: string | null
  vendorCountry: string | null
  vendorState: string | null
  vendorCity: string | null
  setVendorInfo: (info: {
    vendorId: string
    name: string
    picture: string
    country: string
    state: string
    city: string
  }) => void
  clearVendorInfo: () => void
}

export const useVendorStore = create<VendorState>()(
  devtools((set) => ({
    // Wrap your store definition with devtools
    selectedVendorId: null,
    vendorName: null,
    vendorPicture: null,
    vendorCountry: null,
    vendorState: null,
    vendorCity: null,
    setVendorInfo: (info) =>
      set({
        selectedVendorId: info.vendorId,
        vendorName: info.name,
        vendorPicture: info.picture,
        vendorCountry: info.country,
        vendorState: info.state,
        vendorCity: info.city,
      }),

    clearVendorInfo: () =>
      set({
        selectedVendorId: null,
        vendorName: null,
        vendorPicture: null,
        vendorCountry: null,
        vendorState: null,
        vendorCity: null,
      }),
  }))
)
