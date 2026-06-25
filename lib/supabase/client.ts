/**
 * 브라우저(클라이언트 컴포넌트)용 Supabase 클라이언트
 *
 * 사용법:
 *   "use client"
 *   import { createBrowserClient } from "@/lib/supabase/client"
 *   const supabase = createBrowserClient()
 */
import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr";

export function createBrowserClient() {
  return createSupabaseBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)!
  );
}
