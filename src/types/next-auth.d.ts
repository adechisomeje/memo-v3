import { DefaultSession } from 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      firstName: string
      lastName: string
      email: string
      phone: string
    } & DefaultSession['user']
    accessToken?: string // Make accessToken optional
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
