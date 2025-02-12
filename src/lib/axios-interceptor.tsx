'use client'

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { axiosClient } from '../api'

export default function AxiosInterceptor() {
  const { data: session } = useSession()

  useEffect(() => {
    const requestInterceptor = axiosClient.interceptors.request.use(
      async (config) => {
        if (!config.headers['Authorization'] && session?.accessToken) {
          console.log('Setting auth header with token:', session.accessToken)
          config.headers['Authorization'] = `Bearer ${session.accessToken}`
        }
        return config
      }
    )

    // Add response interceptor to handle 401 errors
    const responseInterceptor = axiosClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        console.error(
          'API Error:',
          error.response?.status,
          error.response?.data
        )
        return Promise.reject(error)
      }
    )

    return () => {
      axiosClient.interceptors.request.eject(requestInterceptor)
      axiosClient.interceptors.response.eject(responseInterceptor)
    }
  }, [session])

  return null
}
