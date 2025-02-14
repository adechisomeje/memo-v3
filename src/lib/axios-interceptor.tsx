'use client'

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { axiosClient } from '../api'

export default function AxiosInterceptor() {
  const { data: session, status } = useSession()

  useEffect(() => {
    const requestInterceptor = axiosClient.interceptors.request.use(
      async (config) => {
        // Add some debugging
        console.log('Session state:', {
          status,
          accessToken: session?.accessToken,
        })

        if (status === 'authenticated' && session?.accessToken) {
          // Make sure to set the header for every request
          config.headers['Authorization'] = `Bearer ${session.accessToken}`
          console.log('Added auth header:', config.headers['Authorization'])
        } else {
          console.log('No token available for request')
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    const responseInterceptor = axiosClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          console.error('Authorization error:', {
            status: error.response?.status,
            data: error.response?.data,
            headers: error.config?.headers, // Log the headers that were sent
          })
        }
        return Promise.reject(error)
      }
    )

    return () => {
      axiosClient.interceptors.request.eject(requestInterceptor)
      axiosClient.interceptors.response.eject(responseInterceptor)
    }
  }, [session, status])

  return null
}
