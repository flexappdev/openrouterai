import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type CookieToSet = { name: string; value: string; options: CookieOptions };

const ALLOWED_EMAILS = [
  (process.env.ADMIN_EMAIL ?? "mat@matsiems.com").toLowerCase(),
];

const PUBLIC_PATHS = [
  "/",
  "/models",
  "/rankings",
  "/apps",
  "/enterprise",
  "/pricing",
  "/docs",
  "/about",
  "/login",
  "/auth/callback",
  "/auth/error",
  "/api/v1/models",
  "/opengraph-image",
  "/sitemap.xml",
  "/robots.txt",
];

const PROTECTED_PATHS = [
  "/workspaces",
  "/settings",
  "/activity",
  "/logs",
];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // Env guard: if Supabase isn't configured, never block the public surface.
  // Protected paths still 307 to /login (which itself is public) so the user
  // sees a friendly "auth not configured" message instead of a 500.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const path = request.nextUrl.pathname;
    if (PROTECTED_PATHS.some((p) => path === p || path.startsWith(`${p}/`))) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.search = "?error=unconfigured";
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  let user: { id: string; email?: string | null } | null = null;
  try {
    const { data } = await supabase.auth.getSession();
    user = data.session?.user ?? null;
  } catch {
    user = null;
  }

  const path = request.nextUrl.pathname;
  const isProtected = PROTECTED_PATHS.some(
    (p) => path === p || path.startsWith(`${p}/`)
  );
  const isPublic =
    !isProtected ||
    PUBLIC_PATHS.some((p) => path === p || path.startsWith(`${p}/`));

  if (user && !ALLOWED_EMAILS.includes((user.email ?? "").toLowerCase())) {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "?error=not_allowlisted";
    return NextResponse.redirect(url);
  }

  if (!user && isProtected && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    if (path !== "/") {
      url.searchParams.set("next", path);
    }
    return NextResponse.redirect(url);
  }

  if (user && path === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/workspaces";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
