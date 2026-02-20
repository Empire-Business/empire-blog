import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Se acessando raiz e está em modo dashboard (variável de ambiente)
  if (pathname === '/' && process.env.DASHBOARD_MODE === 'true') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/',
}
