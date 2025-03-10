import { geolocation } from '@vercel/edge'
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { country } = geolocation(request)

  // Define supported countries and their currencies
  const currencyMap: { [key: string]: string } = {
    NG: 'NGN',
    US: 'USD',
    GB: 'GBP',
    // Add more country-currency mappings as needed
  }

  console.log('Geolocation details:', {
    country,
    detectedCurrency: currencyMap[country as keyof typeof currencyMap] || 'USD',
    timestamp: new Date().toISOString(),
  })
  // Set currency based on country, defaulting to USD if country not in currencyMap
  const currency = currencyMap[country as keyof typeof currencyMap] || 'USD'

  const response = NextResponse.next()
  response.cookies.set('currency', currency, {
    path: '/',
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
