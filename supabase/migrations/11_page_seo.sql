-- ==========================================================
-- 말자람터 언어심리연구소: 페이지별 SEO 메타 관리 DB 마이그레이션
-- ==========================================================

CREATE TABLE IF NOT EXISTS public.page_seo (
  id TEXT PRIMARY KEY,
  path TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  keywords TEXT DEFAULT '' NOT NULL,
  og_image_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.page_seo IS '정적 페이지별 구글 검색결과 타이틀 및 Open Graph 메타데이터 설정';

-- RLS 활성화
ALTER TABLE public.page_seo ENABLE ROW LEVEL SECURITY;

-- 익명 읽기 허용
CREATE POLICY "SEO 메타데이터 익명 조회 허용"
ON public.page_seo FOR SELECT
TO public
USING (true);

-- 관리자 전체 관리 허용
CREATE POLICY "관리자 SEO 메타 전체 CRUD 허용"
ON public.page_seo FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 주요 8개 정적 페이지 초기 시드 데이터 주입
INSERT INTO public.page_seo (id, path, title, description, keywords, og_image_url)
VALUES
  ('seo-home', '/', '말자람터 언어심리연구소 | 아이의 맑은 목소리가 피어나는 곳', '따뜻한 눈빛과 따스한 언어로 아이의 내면을 밝히는 언어발달 및 심리치료 전문센터입니다.', '언어치료,심리치료,아동심리상담,발음치료,언어발달진단', '/file.svg'),
  ('seo-about', '/about', '연구소 소개 및 전문가 철학 | 말자람터 언어심리연구소', '우리 아이들의 눈빛과 목소리에 귀 기울이는 따뜻한 임상 전문가 그룹과 연구소 시설을 소개합니다.', '연구소소개,언어치료사프로필,센터장인사말', '/file.svg'),
  ('seo-programs', '/programs', '전문 치료 및 맞춤 성장 프로그램안내 | 말자람터', '언어발달 정밀 평가, 조음 발음 치료, 인지 학습 치료, 부모 양육 상담 등 생애주기별 맞춤 치료 프로그램', '언어평가,조음치료,인지학습치료,부모상담프로그램', '/file.svg'),
  ('seo-reservation', '/reservation', '실시간 온라인 상담 예약 | 말자람터 언어심리연구소', '원하시는 일정과 전문 치료사를 선택하여 간편하게 초기 발달 상담 일정을 예약하세요.', '언어치료예약,아동상담예약,발달검사신청', '/file.svg'),
  ('seo-contact', '/contact', '오시는 길 및 간편 문의 접수 | 말자람터 언어심리연구소', '연구소 위치 안내 주소 및 운영 시간, 온라인 사전 문의 남기기 서비스', '말자람터위치,언어치료전화상담,센터오시는길', '/file.svg'),
  ('seo-faq', '/faq', '자주 묻는 질문 (FAQ) | 말자람터 언어심리연구소', '처음 언어치료를 시작하실 때 학부모님들께서 가장 자주 궁금해하시는 질문과 답변 모음', '언어치료비용,치료시기,실비보험적용여부', '/file.svg'),
  ('seo-news', '/news', '센터 소식 및 발달 칼럼 | 말자람터 언어심리연구소', '말자람터 연구소의 신규 일정 안내와 임상 치료사가 직접 쓰는 양육 칼럼 게시판', '언어발달칼럼,센터공지사항,아동치료정보', '/file.svg'),
  ('seo-gallery', '/gallery', '따뜻한 공간 시설 갤러리 | 말자람터 언어심리연구소', '아이들이 정서적 안정감을 느끼며 치료받을 수 있도록 청결하고 아늑하게 꾸며진 연구소 내부 전경', '언어치료실사진,센터인테리어,교구재안내', '/file.svg')
ON CONFLICT (path) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords;
