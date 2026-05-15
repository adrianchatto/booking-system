import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl

    // Super admin routes — only SUPER_ADMIN role
    if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
      if (token?.role !== 'SUPER_ADMIN') {
        return NextResponse.redirect(new URL('/admin/login', req.url))
      }
    }

    // Tenant admin routes — only TENANT_ADMIN role for their own slug
    const tenantAdminMatch = pathname.match(/^\/([^/]+)\/admin/)
    if (tenantAdminMatch) {
      const slug = tenantAdminMatch[1]
      if (!pathname.includes('/login')) {
        if (token?.role !== 'TENANT_ADMIN') {
          return NextResponse.redirect(new URL(`/${slug}/admin/login`, req.url))
        }
        if ((token as any)?.tenantSlug !== slug) {
          return NextResponse.redirect(new URL(`/${slug}/admin/login`, req.url))
        }
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        // Login pages are always accessible
        if (pathname === '/admin/login') return true
        if (pathname.match(/\/[^/]+\/admin\/login$/)) return true
        // Everything else needs a token
        if (pathname.startsWith('/admin') || pathname.match(/\/[^/]+\/admin/)) {
          return !!token
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/admin/:path*', '/:slug/admin/:path*'],
}
