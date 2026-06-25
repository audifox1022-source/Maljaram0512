-- ==========================================================
-- 말자람터 언어심리연구소: 메인 배너 및 팝업 관리 DB 마이그레이션
-- ==========================================================

CREATE TABLE IF NOT EXISTS public.banners (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  link_url TEXT DEFAULT '' NOT NULL,
  type TEXT DEFAULT 'hero' NOT NULL CHECK (type IN ('hero', 'popup')),
  active BOOLEAN DEFAULT true NOT NULL,
  start_at TIMESTAMPTZ,
  end_at TIMESTAMPTZ,
  display_order INT DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.banners IS '메인 페이지 롤링 히어로 배너 및 진입 팝업 모달 정보';

-- RLS 활성화
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- 익명 조회 조건부 허용 (활성 상태 & 시작일~종료일 범위 일치 시에만 공개)
CREATE POLICY "배너 및 팝업 익명 조건부 조회 허용"
ON public.banners FOR SELECT
TO public
USING (
  active = true
  AND (start_at IS NULL OR start_at <= now())
  AND (end_at IS NULL OR end_at >= now())
);

-- 관리자 전체 권한 허용
CREATE POLICY "관리자 배너 CRUD 허용"
ON public.banners FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 초기 시드 데이터 샘플 (히어로 배너 1개 + 팝업 배너 1개)
INSERT INTO public.banners (id, title, image_url, link_url, type, active, display_order)
VALUES
  ('bn-hero-1', '언어발달 골든타임, 전문 진단 평가 예약', '/file.svg', '/programs', 'hero', true, 1),
  ('bn-popup-1', '🌻 신규 개설: 주말 직장인 부모 상담 프로그램 오픈', '/file.svg', '/reservation', 'popup', true, 1)
ON CONFLICT (id) DO NOTHING;
