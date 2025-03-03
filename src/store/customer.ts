// store/formError.ts
import { create } from 'zustand';

interface FormErrorState {
  isEmptyForm: boolean;
  errorMessage: string;
  setFormError: (isEmpty: boolean, message: string) => void;
  resetFormError: () => void;
}

const useFormErrorStore = create<FormErrorState>((set) => ({
  isEmptyForm: false,
  errorMessage: '',
  setFormError: (isEmpty: boolean, message: string) => 
    set({ isEmptyForm: isEmpty, errorMessage: message }),
  resetFormError: () => set({ isEmptyForm: false, errorMessage: '' }),
}));

export default useFormErrorStore;