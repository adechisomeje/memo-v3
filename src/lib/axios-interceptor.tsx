'use client'

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { axiosClient } from '../api'

export default function AxiosInterceptor() {
  const { data: session } = useSession()

  useEffect(() => {
    const requestInterceptor = axiosClient.interceptors.request.use(
      async (config) => {
        if (!config.headers['Authorization']) {
          console.log("no auth header :( Let's check for the session!")

          if (session) {
            console.log("session exists! Let's set it!")
            config.headers.Authorization = `Bearer ${session.accessToken}`
          }
        }

        return config
      }
    )

    return () => {
      axiosClient.interceptors.request.eject(requestInterceptor)
    }
  }, [session])

  return null
}
