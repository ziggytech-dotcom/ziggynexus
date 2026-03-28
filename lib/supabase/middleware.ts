import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // Detect custom domain: if the host doesn't match NEXT_PUBLIC_SITE_URL,
  // inject it as a header so server components can resolve the client by domain.
  const primaryHost = (process.env.NEXT_PUBLIC_SITE_URL ?? '')
    .replace(/^https?:\/\//, '')
    .split('/')[0]
  const incomingHost = request.headers.get('host') ?? ''

  const requestHeaders = new Headers(request.headers)
  if (primaryHost && incomingHost && incomingHost !== primaryHost) {
    // Strip port for comparison; pass the bare hostname downstream
    const bareHost = incomingHost.split(':')[0]
    requestHeaders.set('x-portal-domain', bareHost)
  }

  let supabaseResponse = NextResponse.next({ request: { ...request, headers: requestHeaders } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request: { ...request, headers: requestHeaders } })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options as Parameters<typeof supabaseResponse.cookies.set>[2])
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Admin routes: only let through if user has an admin email
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const adminEmails = (process.env.ADMIN_EMAILS ?? '').split(',').map((e) => e.trim()).filter(Boolean)
    if (!user || (adminEmails.length > 0 && !adminEmails.includes(user.email ?? ''))) {
      const url = request.nextUrl.clone()
      url.pathname = user ? '/dashboard' : '/login'
      return NextResponse.redirect(url)
    }
  }

  // Protected routes
  const isAuthPage = request.nextUrl.pathname === '/login'
  const isProtected = !isAuthPage && !request.nextUrl.pathname.startsWith('/_next')

  if (isProtected && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (isAuthPage && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
