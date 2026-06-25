-- ==========================================================
-- 말자람터 언어심리연구소: 사진 갤러리(Gallery Items) DB 마이그레이션
-- ==========================================================

CREATE TABLE IF NOT EXISTS public.gallery_items (
  id TEXT PRIMARY KEY,
  image_url TEXT NOT NULL,
  caption TEXT,
  category TEXT DEFAULT '치료실시설',
  display_order INT DEFAULT 0 NOT NULL,
  published BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.gallery_items IS '연구소 시설 안내 및 치료 교구 사진 갤러리 목록';

-- RLS 활성화
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

-- 익명 공개 조회 허용
CREATE POLICY "공개된 갤러리 익명 조회 허용"
ON public.gallery_items FOR SELECT
TO public
USING (published = true);

-- 관리자 전체 권한 허용
CREATE POLICY "관리자 갤러리 전체 CRUD 허용"
ON public.gallery_items FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 샘플 시드 데이터 4종
INSERT INTO public.gallery_items (id, image_url, caption, category, display_order, published)
VALUES
  ('gal-1', 'https://picsum.photos/seed/maljarum_gal1/800/600', '햇살이 잘 드는 포근하고 청결한 개인 치료실 전경', '치료실시설', 1, true),
  ('gal-2', 'https://picsum.photos/seed/maljarum_gal2/800/600', '아이들의 눈높이에 맞춘 다양한 원목 치료 교구재', '치료교구', 2, true),
  ('gal-3', 'https://picsum.photos/seed/maljarum_gal3/800/600', '부모님이 편안하게 대기하실 수 있는 따뜻한 대기실', '내부전경', 3, true),
  ('gal-4', 'https://picsum.photos/seed/maljarum_gal4/800/600', '감각통합 및 대근육 발달을 돕는 특별 치료실', '치료실시설', 4, true)
ON CONFLICT (id) DO NOTHING;

-- 상단 메뉴(nav_menus)에 갤러리가 없다면 추가 시드
INSERT INTO public.nav_menus (id, label, href, location, display_order, visible)
SELECT 'menu_gallery', '센터 갤러리', '/gallery', 'header', 4, true
WHERE NOT EXISTS (
  SELECT 1 FROM public.nav_menus WHERE href = '/gallery'
);
