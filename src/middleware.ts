import { type NextRequest, NextResponse } from 'next/server'

export default function middleware(request: NextRequest) {
  const { url, cookies, nextUrl } = request

  const session = cookies.get('session')?.value
  const isProfilePage = nextUrl.pathname.startsWith('/profile')

  if (isProfilePage && !session) {
    return NextResponse.redirect(new URL('/?auth=true', url))
  }

  if (session && nextUrl.pathname === '/profile') {
    return NextResponse.redirect(new URL('/profile/settings', url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/profile/:path*']
}
