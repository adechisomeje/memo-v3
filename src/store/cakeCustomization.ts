import { create } from 'zustand'
import { CakeCustomizationSchema } from '@/app/customers/results/page'

interface CakeCustomizationStore {
  customization: CakeCustomizationSchema | null
  selectedCakeId: string | null
  setCustomization: (customization: CakeCustomizationSchema) => void
  setSelectedCakeId: (id: string) => void
  reset: () => void
}

export const useCakeCustomization = create<CakeCustomizationStore>((set) => ({
  customization: null,
  selectedCakeId: null,
  setCustomization: (customization) => set({ customization }),
  setSelectedCakeId: (id) => set({ selectedCakeId: id }),
  reset: () => set({ customization: null, selectedCakeId: null }),
}))
