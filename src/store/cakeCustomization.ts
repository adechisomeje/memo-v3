// store/cakeCustomization.ts
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { CakeCustomizationSchema } from '@/app/customers/results/page'
import { Cake } from '@/api/public'

interface CakeCustomizationState {
  customization: (CakeCustomizationSchema & { price?: number }) | null // Add price here, keep optional
  selectedCakeId: string | null
  selectedCake: Cake | null
  setCustomization: (
    customization: CakeCustomizationSchema & { price?: number }
  ) => void // Update type here
  setSelectedCakeId: (id: string) => void
  setSelectedCake: (cake: Cake) => void
  reset: () => void
}

export const useCakeCustomization = create<CakeCustomizationState>()(
  persist(
    (set) => ({
      customization: { flavour: '', size: '', layers: '', icing: '', price: 0 }, // Initialize with price
      selectedCakeId: null,
      selectedCake: null,
      setCustomization: (customization) => set(() => ({ customization })),
      setSelectedCakeId: (id) => set(() => ({ selectedCakeId: id })),
      setSelectedCake: (cake) => set(() => ({ selectedCake: cake })),
      reset: () =>
        set(() => ({
          customization: {
            flavour: '',
            size: '',
            layers: '',
            icing: '',
            price: 0,
          }, // Reset with price
          selectedCakeId: null,
          selectedCake: null,
        })),
    }),
    {
      name: 'cake-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedCake: state.selectedCake,
        selectedCakeId: state.selectedCakeId,
        customization: state.customization,
      }),
    }
  )
)
