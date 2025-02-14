import { axiosClient } from '.'

interface CreateOrderResponse {
  message: string
  authorization_url: string
  orderId: string
}

export async function userCreateOrder(data: {
  productId: string
  note: string
  recipientName: string
  recipientPhone: string
  layers: string
  size: string
  topping: string
  flavours: string
  deliveryDate: string
}) {
  const response = await axiosClient.post<CreateOrderResponse>('/orders', data)

  return response.data
}
