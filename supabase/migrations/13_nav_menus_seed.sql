-- ============================================================================
-- 13_nav_menus_seed.sql
-- 상단 메뉴 숨김 및 동적 네비게이션 동작을 위한 테이블 생성 및 초기 데이터 시드 삽입
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.nav_menus (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  location TEXT DEFAULT 'header' NOT NULL CHECK (location IN ('header', 'footer')),
  display_order INT DEFAULT 0 NOT NULL,
  visible BOOLEAN DEFAULT true NOT NULL,
  parent_id TEXT REFERENCES public.nav_menus(id) ON DELETE CASCADE
);

ALTER TABLE public.nav_menus ENABLE ROW LEVEL SECURITY;

-- 익명 읽기 허용 (visible = true인 항목만 노출)
DO $$ BEGIN
  EXECUTE 'CREATE POLICY "네비 읽기 허용" ON public.nav_menus FOR SELECT TO public USING (visible = true)';
EXCEPTION WHEN OTHERS THEN NULL; END $$;

-- 관리자(체험판 전용 익명 모드 포함) 전체 쓰기 허용
DO $$ BEGIN
  EXECUTE 'CREATE POLICY "네비 쓰기 개방" ON public.nav_menus FOR ALL TO public USING (true) WITH CHECK (true)';
EXCEPTION WHEN OTHERS THEN NULL; END $$;

-- 현재 헤더 메뉴 시드 데이터 삽입
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
ON CONFLICT (id) DO UPDATE 
SET 
  label = EXCLUDED.label,
  href = EXCLUDED.href,
  display_order = EXCLUDED.display_order;
