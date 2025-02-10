import { axiosClient } from '.'

interface Buyer {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
}

interface AuthResponse {
  message: string
  token: string
  user: Buyer
}

type SignUpResponse = AuthResponse
type SignInResponse = AuthResponse

export async function buyerLogin(data: { email: string; password: string }) {
  const response = await axiosClient.post<SignInResponse>('/auth/signin', data)

  return response.data
}

export async function register(data: {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
}) {
  const response = await axiosClient.post<SignUpResponse>('/auth/signup', data)

  return response.data
}

export async function vendorSignUp(data: {
  firstName: string
  lastName: string
  email: string
  phone: string
  country: string
  businessName: string
  instagram: string
  businessAddress: string
}) {
  const response = await axiosClient.post<SignUpResponse>(
    '/vendor/auth/signup',
    data
  )

  return response.data
}
