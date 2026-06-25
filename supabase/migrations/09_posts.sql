-- ==========================================================
-- 말자람터 언어심리연구소: 공지사항 및 센터 소식(Posts) DB 마이그레이션
-- ==========================================================

CREATE TABLE IF NOT EXISTS public.posts (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT DEFAULT '공지사항' NOT NULL,
  published BOOLEAN DEFAULT true NOT NULL,
  published_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.posts IS '센터 공지사항 및 치료 일정·칼럼 소식 게시판';

-- RLS 활성화
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- 익명 공개 조건부 조회 허용 (게시 승인 & 예약 게시일 도달 시에만)
CREATE POLICY "게시된 소식 익명 조건부 조회 허용"
ON public.posts FOR SELECT
TO public
USING (published = true AND published_at <= now());

-- 관리자 전체 관리 허용
CREATE POLICY "관리자 소식 전체 CRUD 허용"
ON public.posts FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 샘플 시드 데이터 2종
INSERT INTO public.posts (id, slug, title, body, category, published, published_at)
VALUES
  ('post-1', 'welcome-maljarumter', '🌻 말자람터 언어심리연구소 공식 홈페이지 오픈 안내', '안녕하세요. 말자람터 언어심리연구소입니다.\n\n더욱 편리한 온라인 예약 접수와 소통을 위해 공식 웹사이트를 새롭게 개설하였습니다.\n앞으로 아이들의 발달에 도움이 되는 유익한 언어치료 칼럼과 센터 소식을 꾸준히 전해드리겠습니다.\n\n감사합니다.', '공지사항', true, now()),
  ('post-2', 'summer-language-camp', '2026년 여름방학 맞춤형 사회성 언어 그룹 프로그램 모집', '여름방학 기간 동안 또래 친구들과 규칙을 익히고 자기 생각을 명확하게 전달하는 [여름방학 사회성 언어 그룹]을 모집합니다.\n\n- 대상: 6세~초등학교 저학년\n- 시간: 주 2회 (화/목 오후)\n- 신청 방법: 상단 [온라인 상담 예약] 메뉴를 통해 접수 가능합니다.', '센터소식', true, now())
ON CONFLICT (slug) DO NOTHING;

-- 네비게이션 메뉴(nav_menus) 테이블에 '소식' 링크가 없다면 자동 추가 시드
INSERT INTO public.nav_menus (id, label, href, location, display_order, visible)
SELECT 'menu_news', '소식·공지', '/news', 'header', 3, true
WHERE NOT EXISTS (
  SELECT 1 FROM public.nav_menus WHERE href = '/news'
);
