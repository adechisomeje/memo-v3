import { axiosClient } from '.'

export interface Cake {
  _id: string
  thumbnail: string
  price: number
  vendorName: string
  vendorPicture: string
  vendorCountry: string
  vendorState: string
  vendorCity: string
}

export interface CakeResponse {
  message: string
  page: number
  totalPages: number
  totalCount: number
  cakes: Cake[]
}

export interface VendorCountriesResponse {
  message: string
  countries: string[]
}

export interface VendorStatesResponse {
  message: string
  states: string[]
}

export interface VendorCitiesResponse {
  message: string
  cities: string[]
}

export async function getCountry() {
  const response = await axiosClient.get<VendorCountriesResponse>(
    '/public/vendors/countries'
  )
  return response.data
}

export async function getStates(country: string) {
  const response = await axiosClient.get<VendorStatesResponse>(
    `/public/vendors/states?country=${country}`
  )
  return response.data
}

export async function getCities(country: string, state: string) {
  const response = await axiosClient.get<VendorCitiesResponse>(
    `/public/vendors/cities?country=${country}&state=${state}`
  )
  return response.data
}

export async function getCakeProducts() {
  const response = await axiosClient.get<CakeResponse>('/public/products/cakes')
  return response.data
}
