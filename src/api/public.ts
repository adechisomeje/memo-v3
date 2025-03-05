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
  layerPrices: Record<string, number>
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
  vendorAverageRating: number
  vendorCity: string
  size: string
  flavours: string[]
  topping: string
  layers: number
  layerPrices: {
    [key: number]: number
  }
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

export async function getCountry() {
  const response = await axiosClient.get<ApiResponse<VendorCountriesResponse>>(
    '/vendors/public/countries'
  )

  return response.data
}

export async function getStates(country: string) {
  const response = await axiosClient.get<ApiResponse<VendorStatesResponse>>(
    `/vendors/public/states?country=${country}`
  )
  return response.data
}

export async function getCities(country: string, state: string) {
  const response = await axiosClient.get<ApiResponse<VendorCitiesResponse>>(
    `/vendors/public/cities?country=${country}&state=${state}`
  )
  return response.data
}

export async function getCakeProducts(country: string, state: string, city: string, page: number, limit: number) {
  const response = await axiosClient.get<ApiResponse<CakeResponseData>>(
    `/cakes/public?country=${country}&state=${state}&city=${city}&page=${page}&limit=${limit}`
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
  priceMax?: number,) {
  const response = await axiosClient.get(
`/products/filter?category=${category}&country=${country}&state=${state}&city=${city}&page=${page}&limit=${limit}&size=${size}&priceMin=${priceMin}&priceMax=${priceMax}`
  )
  return response.data.data
}
