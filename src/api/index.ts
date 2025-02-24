import axios from 'axios'

export type ApiResponse<T = undefined> = {
  statusCode: number
  message: string
  data: T extends undefined ? undefined : T
}

const BASE_URL = 'https://memo-backend-nestjs.onrender.com/api/v1'

export const axiosClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})
