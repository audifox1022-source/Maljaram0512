import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const url = new URL(req.url);
  const isAdminPath = url.pathname.startsWith("/admin");
  const isLoginPage = url.pathname === "/admin/login";

  if (!isAdminPath) {
    return res;
  }

  // 로컬 테스트 및 초보자 체험용 Mock 관리자 세션 쿠키 체크
  const mockCookie = req.cookies.get("maljarumter_admin_mock")?.value === "authenticated";
  const bypassEnv = process.env.BYPASS_ADMIN_AUTH === "true";

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  let isAuthenticated = mockCookie || bypassEnv;

  if (supabaseUrl && supabaseKey && supabaseUrl !== "your_supabase_project_url") {
    try {
      const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          getAll() {
            return req.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
            res = NextResponse.next({
              request: {
                headers: req.headers,
              },
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              res.cookies.set(name, value, options)
            );
          },
        },
      });

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        isAuthenticated = true;
      }
    } catch (err) {
      console.warn("미들웨어 Supabase 세션 검증 예외:", err);
    }
  }

  /* ── 인증 가드 리다이렉트 로직 ── */
  if (isAdminPath && !isLoginPage && !isAuthenticated) {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("redirect", url.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * _next/static, _next/image, favicon.ico 등 정적 에셋 제외한 모든 요청 매칭
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
