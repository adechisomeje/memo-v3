import { axiosClient } from '.'

export interface CreateOrderResponse {
  data: {
    message: string
    authorization_url: string
    orderId: string
  }
}

type PerformedBy = {
  role: 'CUSTOMER' | 'VENDOR' | 'ADMIN' // Adjust roles as needed
  _id: string
  email: string
}

type TimelineEntry = {
  timestamp: string
  action: string
  description: string
  performedBy: PerformedBy
  comment: string
}

type OrderTimelineResponse = {
  statusCode: number
  data: TimelineEntry[]
  message: string
}

export async function userCreateOrder(data: {
  productId: string
  productCategory: string
  note: string
  recipientName: string
  recipientPhone: string
  layers: number
  size: string
  topping: string
  flavours: string[]
  deliveryAddress: {
    address: string
    city: string
    state: string
    country: string
  }
  deliveryDate: string
  additionalProducts: {
    productId: string
    productCategory: string
    quantity: number
  }[]
}) {
  const response = await axiosClient.post<CreateOrderResponse>('/orders', data)

  return response.data
}

export async function getOrderTimeline(orderId: string) {
  const response = await axiosClient.get<OrderTimelineResponse>(
    `/orders/${orderId}/timeline`
  )
  return response.data
}
