import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function validateBankAccountNumber(accountNumber: string) {
  const regex = /^[0-9]{10}$/
  return regex.test(accountNumber)
}

export function validateName(name: string) {
  const regex = /^[A-Za-z]+$/
  return regex.test(name)
}

export function validatePassword(password: string) {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-_+=<>?])[A-Za-z\d!@#$%^&*()-_+=<>?]{8,}$/
  return regex.test(password)
}

export function validatePhone(phone: string) {
  const regex = /^0\d{10}$/
  return regex.test(phone)
}

export function generateInitials(fullname: string): string {
  const [firstName, surname] = fullname.split(' ')
  const firstInitial = firstName.charAt(0).toUpperCase()
  const surnameInitial = surname.charAt(0).toUpperCase()
  return `${firstInitial}${surnameInitial}`
}
