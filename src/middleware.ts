import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Bypass static assets, internal Next.js paths, and public media
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 2. Refresh Supabase session cookie on request
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  if (supabaseUrl && supabaseKey) {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Refresh auth session
    try {
      await supabase.auth.getUser();
    } catch {
      // Ignore network errors in middleware
    }
  }

  // 3. Admin Route Protection (lazy-loaded, separate route group)
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login" || pathname === "/admin/2fa") {
      return response;
    }

    // Role check via secure httpOnly admin session cookie
    const adminSessionToken = request.cookies.get("padanama_admin_token")?.value;
    if (!adminSessionToken) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return response;
  }

  // 4. Delegate to trilingual next-intl middleware for store, account, and reader routes
  const intlResponse = intlMiddleware(request);
  
  // Forward any refreshed Supabase cookies into intlResponse
  response.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie.name, cookie.value);
  });

  return intlResponse;
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
