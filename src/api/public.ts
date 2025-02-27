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

export async function getCakeProducts() {
  const response = await axiosClient.get<ApiResponse<CakeResponseData>>(
    '/cakes/public'
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
  const response = await axiosClient.get<ApiResponse<CakeData[]>>(
    `/reviews/vendor/${vendorId}`
  )
  return response.data.data
}
