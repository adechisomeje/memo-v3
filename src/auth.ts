import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { buyerLogin, register } from './api/auth'
import type { User } from 'next-auth' // Import the User type

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      id: 'signIn',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        if (!credentials) {
          throw new Error('Missing Email Address or Password')
        }

        try {
          const res = await buyerLogin({
            email: credentials.email as string,
            password: credentials.password as string,
          })
          // Return the full user object, including the token
          return {
            ...res.user, // Spread the user properties
            token: res.token, // Include the access token
          } as User
        } catch (error) {
          console.log(error)
          throw new Error('Something went wrong.')
        }
      },
    }),
    Credentials({
      id: 'signUp',
      credentials: {
        firstName: { label: 'First Name', type: 'text' },
        lastName: { label: 'Last Name', type: 'text' },
        email: { label: 'Email', type: 'email', placeholder: 'email' },
        password: { label: 'Password', type: 'password' },
        phone: { label: 'Phone Number', type: 'text' },
      },
      authorize: async (credentials) => {
        if (!credentials) {
          throw new Error('Missing Email Address or Password')
        }

        try {
          console.log('firing request')
          const res = await register({
            firstName: credentials.firstName as string,
            lastName: credentials.lastName as string,
            email: credentials.email as string,
            password: credentials.password as string,
            phone: credentials.phone as string,
          })

          // Return the full user object, including the token
          return {
            ...res.user, // Spread the user properties
            token: res.token, // Include the access token
          } as User
        } catch (error) {
          console.log(error)
          throw new Error('Something went wrong.')
        }
      },
    }),
  ],
  session: { strategy: 'jwt' }, // Add this line
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id ?? ''
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.email = user.email ?? ''
        token.phone = user.phone
        token.accessToken = user.token // Store the access token in the JWT
      }
      return token
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user.id = token.id
        session.user.firstName = token.firstName
        session.user.lastName = token.lastName
        session.user.email = token.email
        session.user.phone = token.phone
        session.accessToken = token.accessToken // Expose accessToken in the session
      }
      return session
    },
  },
})
