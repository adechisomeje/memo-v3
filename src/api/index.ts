import axios from 'axios'

const BASE_URL = 'https://memo-v3-api.onrender.com/api'

export const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})
