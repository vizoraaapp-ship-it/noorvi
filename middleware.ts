import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
    const res = NextResponse.next()

    // Safety check for env vars to prevent build/runtime crash
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

    const supabase = createMiddlewareClient({ req, res }, {
        supabaseUrl,
        supabaseKey
    })

    const {
        data: { session },
    } = await supabase.auth.getSession()

    // Protect routes
    if (!session && (req.nextUrl.pathname.startsWith('/account') || req.nextUrl.pathname.startsWith('/cart') || req.nextUrl.pathname.startsWith('/checkout') || req.nextUrl.pathname.startsWith('/wishlist'))) {
        return NextResponse.redirect(new URL('/login', req.url))
    }

    // Redirect if already logged in
    if (session && (req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/signup'))) {
        return NextResponse.redirect(new URL('/account', req.url))
    }

    // Admin Route Protection
    if (req.nextUrl.pathname.startsWith('/admin/')) {
        const adminSession = req.cookies.get('admin_session_token')
        if (!adminSession) {
            return NextResponse.redirect(new URL('/admin', req.url))
        }
    }

    // Redirect /admin login page to dashboard if already logged in
    if (req.nextUrl.pathname === '/admin') {
        const adminSession = req.cookies.get('admin_session_token')
        if (adminSession) {
            return NextResponse.redirect(new URL('/admin/dashboard', req.url))
        }
    }

    return res
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
