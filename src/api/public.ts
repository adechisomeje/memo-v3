import { axiosClient } from '.'

interface Cake {
  _id: string
  thumbnail: string
  price: number
  vendorName: string
  vendorPicture: string
}

interface CakeResponse {
  message: string
  page: number
  totalPages: number
  totalCount: number
  cakes: Cake[]
}

interface VendorCountriesResponse {
  message: string
  countries: string[]
}

interface VendorStatesResponse {
  message: string
  states: string[]
}

interface VendorCitiesResponse {
  message: string
  cities: string[]
}

export async function getCountry() {
  const response = await axiosClient.get<{ data: VendorCountriesResponse }>(
    '/public/vendors/countries'
  )
  return response.data
}

export async function getStates(country: string) {
  const response = await axiosClient.get<{ data: VendorStatesResponse }>(
    `/public/vendors/states?country=${country}`
  )
  return response.data
}

export async function getCities(country: string, state: string) {
  const response = await axiosClient.get<{ data: VendorCitiesResponse }>(
    `/public/vendors/cities?country=${country}&state=${state}`
  )
  return response.data
}

export async function getCakeProducts() {
  const response = await axiosClient.get<{ data: Cake[] }>(
    '/public/products/cakes'
  )

  return response.data
}
