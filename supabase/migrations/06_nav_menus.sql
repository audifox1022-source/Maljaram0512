-- ==========================================================
-- 말자람터 언어심리연구소: 동적 네비게이션 메뉴 관리 DB 마이그레이션
-- ==========================================================

CREATE TABLE IF NOT EXISTS public.nav_menus (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  location TEXT DEFAULT 'header' NOT NULL CHECK (location IN ('header', 'footer')),
  display_order INT DEFAULT 0 NOT NULL,
  visible BOOLEAN DEFAULT true NOT NULL,
  parent_id TEXT REFERENCES public.nav_menus(id) ON DELETE CASCADE
);

COMMENT ON TABLE public.nav_menus IS '상단 헤더 및 하단 푸터 네비게이션 메뉴 링크 목록';

-- RLS 활성화
ALTER TABLE public.nav_menus ENABLE ROW LEVEL SECURITY;

-- 익명 조회 허용
CREATE POLICY "네비게이션 메뉴 익명 조회 허용"
ON public.nav_menus FOR SELECT
TO public
USING (visible = true);

-- 관리자 전체 관리 허용
CREATE POLICY "관리자 네비게이션 메뉴 CRUD 허용"
ON public.nav_menus FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 초기 시드 데이터 (상단 헤더 메뉴 6종 + 푸터 메뉴)
INSERT INTO public.nav_menus (id, label, href, location, display_order, visible)
VALUES
  ('nm-home', '홈', '/', 'header', 1, true),
  ('nm-about', '소개', '/about', 'header', 2, true),
  ('nm-programs', '프로그램', '/programs', 'header', 3, true),
  ('nm-reservation', '예약', '/reservation', 'header', 4, true),
  ('nm-contact', '문의', '/contact', 'header', 5, true),
  ('nm-faq', 'FAQ', '/faq', 'header', 6, true),
  ('fm-about', '연구소 소개', '/about', 'footer', 1, true),
  ('fm-programs', '치료 프로그램', '/programs', 'footer', 2, true),
  ('fm-reservation', '온라인 예약', '/reservation', 'footer', 3, true),
  ('fm-contact', '상담 문의', '/contact', 'footer', 4, true),
  ('fm-faq', '자주 묻는 질문', '/faq', 'footer', 5, true)
ON CONFLICT (id) DO NOTHING;
