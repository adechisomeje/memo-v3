import { axiosClient } from '.'

export interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  profilePicture: string
  __v: number
}

export interface UserSettingsResponse {
  message: string
  user: User
}
type UserOrderResponse = {
  statusCode: number
  data: {
    orders: Order[]
    pagination: Pagination
  }
  message: string
}

type Order = {
  _id: string
  vendor: Vendor
  product: Product
  productCategory: string
  amount: number
  deliveryDate: string // ISO date string
  status: string
  createdAt: string // ISO date string
}

type Vendor = {
  _id: string
  businessName: string
  profilePicture: string
}

type Product = {
  _id: string
  name: string
  images: string[]
  category: string
  productType: string
}

type Pagination = {
  page: number
  limit: number
  totalCount: number
  totalPages: number
}

export async function getUserProfile() {
  const response = await axiosClient.get<UserSettingsResponse>(
    '/users/settings'
  )

  return response.data
}

export async function getUserOrders() {
  const response = await axiosClient.get<UserOrderResponse>('/orders/user')

  return response.data
}
