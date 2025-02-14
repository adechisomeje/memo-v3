import { DefaultSession } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import 'next-auth'

declare module 'next-auth' {
  interface Session {
    accessToken?: string
    user: {
      id: string
      firstName: string
      lastName: string
      email: string
      phone: string
    } & DefaultSession['user']
  }

  interface User {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    token: string // VERY IMPORTANT
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    accessToken?: string
  }
}

console.log(JWT)
