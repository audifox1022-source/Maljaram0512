-- ==========================================================
-- 말자람터 언어심리연구소: 콘텐츠 동적 관리를 위한 CMS 테이블 마이그레이션
-- ==========================================================
-- 이 스크립트를 Supabase 대시보드 [SQL Editor]에서 실행하세요.

-- 1. 홈페이지 주요 텍스트 및 이미지 섹션 (site_sections)
CREATE TABLE IF NOT EXISTS public.site_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  image_urls JSONB DEFAULT '[]'::jsonb NOT NULL,
  display_order INT DEFAULT 0 NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.site_sections IS '홈페이지 히어로, 인사말, 비전 등 정적 섹션 콘텐츠 관리';

-- 2. 전문가 소개 프로필 (staff)
CREATE TABLE IF NOT EXISTS public.staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  photo_url TEXT,
  bio TEXT NOT NULL,
  display_order INT DEFAULT 0 NOT NULL,
  published BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.staff IS '센터 소속 치료사 및 연구 인력 소개 관리';

-- 3. 자주 묻는 질문 (faqs)
CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INT DEFAULT 0 NOT NULL,
  published BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.faqs IS '학부모 자주 묻는 질문 아코디언 콘텐츠 관리';

-- 4. RLS 활성화 및 보안 규칙
ALTER TABLE public.site_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- 읽기 정책 (누구나 공개된 콘텐츠 조회 가능)
CREATE POLICY "누구나 섹션 콘텐츠 조회 가능" ON public.site_sections FOR SELECT USING (true);
CREATE POLICY "누구나 공개 인력 조회 가능" ON public.staff FOR SELECT USING (published = true);
CREATE POLICY "누구나 공개 FAQ 조회 가능" ON public.faqs FOR SELECT USING (published = true);

-- 관리자 전체 조작 정책 (쓰기/수정/삭제)
CREATE POLICY "관리자 섹션 전체 조작" ON public.site_sections FOR ALL TO authenticated USING (true);
CREATE POLICY "관리자 인력 전체 조작" ON public.staff FOR ALL TO authenticated USING (true);
CREATE POLICY "관리자 FAQ 전체 조작" ON public.faqs FOR ALL TO authenticated USING (true);

-- 익명 데이터 추가 허용 (데모 체험 및 서버 API 호환)
CREATE POLICY "누구나 CMS 조작 가능(데모)" ON public.site_sections FOR ALL USING (true);
CREATE POLICY "누구나 인력 조작 가능(데모)" ON public.staff FOR ALL USING (true);
CREATE POLICY "누구나 FAQ 조작 가능(데모)" ON public.faqs FOR ALL USING (true);


-- 5. 초기 더미 시드 데이터 삽입
INSERT INTO public.site_sections (key, title, body, image_urls, display_order)
VALUES 
(
  'hero',
  '아이의 맑은 목소리, 말자람터가 함께 피워냅니다',
  '따뜻한 눈빛과 따스한 언어로 아이의 내면을 밝히는 곳. 공인 1급 언어재활사와 임상심리전문가가 한 명 한 명의 맞춤 성장 여정을 동행합니다.',
  '["https://picsum.photos/seed/maljarum1/800/600"]'::jsonb,
  1
),
(
  'greeting',
  '원장 인사말: 소통의 기쁨을 선물합니다',
  '안녕하세요. 말자람터 언어심리연구소 대표원장 김지수입니다. 아이들이 세상과 처음 맺는 관계의 시작은 바로 따스한 소통입니다. 조급함 대신 기다림으로, 정형화된 훈련 대신 놀이 속 자발성으로 아이가 스스로 말문을 열 수 있도록 가장 안전한 발달 둥지가 되겠습니다.',
  '["https://picsum.photos/seed/about1/600/400"]'::jsonb,
  2
),
(
  'vision',
  '센터 핵심 비전 3가지',
  '1. 아동 중심 자발성 촉진 치료\n2. 가정 연계 부모 코칭 시스템\n3. 다학제 협력 통합 진단 평가',
  '[]'::jsonb,
  3
)
ON CONFLICT (key) DO UPDATE SET title = EXCLUDED.title, body = EXCLUDED.body;

-- 전문가 시드 데이터
INSERT INTO public.staff (name, role, photo_url, bio, display_order, published)
VALUES
('김지수 원장', '대표 언어재활사 (1급)', 'https://picsum.photos/seed/staff1/400/400', '• 연세대학교 언어병리학 석사\n• 전 대학병원 소아청소년과 언어치료실장\n• 보건복지부 1급 언어재활사', 1, true),
('박서연 치료사', '수석 놀이심리전문가', 'https://picsum.photos/seed/staff2/400/400', '• 이화여자대학교 아동심리학 석사\n• 한국심리학회 임상심리전문가\n• RT 부모상호작용 전문가', 2, true),
('이진우 연구원', '인지언어 담당 치료사', 'https://picsum.photos/seed/staff3/400/400', '• 한림대학교 언어청각학 학사\n• 발음 및 조음 명료도 전문 치료사\n• AAC 보완대체의사소통 교육 이수', 3, true);

-- FAQ 시드 데이터
INSERT INTO public.faqs (question, answer, display_order, published)
VALUES
('초기 상담 및 평가 시간은 얼마나 걸리나요?', '부모님 초기 상담(15분) + 아동 1:1 맞춤 진단평가(40분) + 종합 결과 상담(15분)으로 총 70~80분 정도 소요됩니다.', 1, true),
('치료 세션 진행 시 부모가 참관할 수 있나요?', '아동의 분리 불안 정도나 치료 목표에 따라 첫 1~2회기는 매직미러를 통한 참관이나 동반 입장을 유연하게 지원합니다.', 2, true),
('보건복지부 발달재활 바우처 사용이 가능한가요?', '네, 저희 말자람터는 보건복지부 지정 발달재활서비스 및 교육청 특수교육대상자 치료지원 바우처 공식 제공기관입니다.', 3, true),
('주차 지원 및 찾아오는 길 안내 부탁드립니다.', '건물 지하주차장에 시간 제한 없이 넉넉하게 무료 주차 등록을 해 드립니다. 대중교통 이용 시 ○○역 3번 출구에서 도보 3분 거리입니다.', 4, true);
