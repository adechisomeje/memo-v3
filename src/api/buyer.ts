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

import { axiosClient } from '.'

export async function getUserProfile() {
  const response = await axiosClient.get<{ data: UserSettingsResponse }>(
    '/users/settings'
  )

  return response.data
}
