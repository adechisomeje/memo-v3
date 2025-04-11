import { axiosClient, ApiResponse } from '.'

interface CakeResponseData {
  message: string
  page: number
  totalPages: number
  totalCount: number
  cakes: Cake[]
}

export interface CakeData {
  // filter: any
  _id: string
  thumbnail: string
  price: number
  vendorId: string
  vendorName: string
  vendorPicture: string
  vendorCountry: string
  vendorState: string
  vendorCity: string
  vendorAverageRating: number
  size: string
  flavours: string[]
  topping: string
  layers: number
  deliveryInfo: Record<string, number>
  layerPrices: Record<string, number>
}
export interface DeliveryInfo {
  city: string
  deliveryPrice: number
  isBasePrice: boolean
}

export interface Cake {
  _id: string
  thumbnail: string
  price: number
  vendorId: string
  vendorName: string
  vendorPicture: string
  vendorCountry: string
  vendorState: string
  vendorCity: string
  vendorAverageRating: number
  size: string
  flavours: string[]
  topping: string
  layers: number
  layerPrices: {
    [key: string]: number
  }
  deliveryInfo: { [key: string]: number }
}


type ReviewReply = {
  user: string
  userModel: 'Vendor'
  isVendorReply: boolean
  comment: string
  // likes: any[]
  createdAt: string
  updatedAt: string
  _id: string
}

type Review = {
  _id: string
  order: {
    _id: string
    product: string
    deliveryDate: string
  }
  vendor: string
  user: {
    _id: string
    firstName: string
    lastName: string
    profilePicture: string
  }
  rating: number
  comment: string
  // likes: any[]
  replies: ReviewReply[]
  createdAt: string
  updatedAt: string
  __v: number
}

type Stats = {
  totalReviews: number
  averageRating: number
  ratingCount: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
}

type ReviewResponse = {
  stats: Stats
  reviews: Review[]
}

export interface VendorProductsResponse {
  statusCode: number
  data: CakeData[]
  message: string
}

interface WaitlistEntry {
  name: string
  phone: string
  email: string
  country: string
  state: string
  city: string
  productType: string
  status: string
  notes: string
  _id: string
  createdAt: string
  updatedAt: string
  __v: number
}

export type LocationResponse = {
  statusCode: number
  data: {
    [country: string]: {
      states: {
        [state: string]: {
          cities: string[]
        }
      }
    }
  }
  message: string
}

export interface VendorCountriesResponse {
  countries: string[]
}

export interface VendorStatesResponse {
  states: string[]
}

export interface VendorCitiesResponse {
  cities: string[]
}

export async function getLocations() {
  const response = await axiosClient.get<LocationResponse>(
    '/vendors/public/location-hierarchy'
  )

  console.log(response.data)

  return response.data
}

export async function getCakeProducts(
    category: string,
  country: string,
  state: string,
  city: string,
  page: number,
  limit: number,
  deliveryDate: Date
) {
  const response = await axiosClient.get<ApiResponse<CakeResponseData>>(
    `products/filter?category=${category}&country=${country}&state=${state}&city=${city}&page=${page}&limit=${limit}&deliveryDate=${deliveryDate}`
  )
  return response.data
}

export async function getCakeProductsByVendor(vendorId: string) {
  const response = await axiosClient.get<ApiResponse<CakeData[]>>(
    `/cakes/vendor/${vendorId}/public`
  )
  return response.data.data
}

export async function getVendorReviews(vendorId: string) {
  const response = await axiosClient.get<ApiResponse<ReviewResponse>>(
    `/reviews/vendor/${vendorId}`
  )
  return response.data.data
}

export async function filterPublicProducts(
  category?: string,
  country?: string,
  state?: string,
  city?: string,
  page?: number,
  limit?: number,
  size?: string,
  priceMin?: number,
  priceMax?: number,
  deliveryDate?: string
) {
  const params: Record<string, string | number> = {}

  if (category) params.category = category
  if (country) params.country = country
  if (state) params.state = state
  if (city) params.city = city
  if (page) params.page = page
  if (limit) params.limit = limit
  if (size) params.size = size
  if (priceMin) params.priceMin = priceMin
  if (priceMax) params.priceMax = priceMax
  if (deliveryDate) params.deliveryDate = deliveryDate

  const response = await axiosClient.get('/products/filter', { params })
  return response.data.data
}

export async function productWaitlist(data: {
  name: string
  phone: string
  email: string
  country: string
  state: string
  city: string
  productType: string
  notes: string
  userId: string
}) {
  const response = await axiosClient.post<ApiResponse<WaitlistEntry>>(
    '/product-waitlists',
    data,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(
          'next-auth.session-token'
        )}`,
      },
    }
  )

  return response.data
}
