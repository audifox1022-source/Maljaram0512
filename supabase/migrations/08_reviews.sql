-- ==========================================================
-- 말자람터 언어심리연구소: 이용 후기(Reviews) DB 마이그레이션
-- ==========================================================

CREATE TABLE IF NOT EXISTS public.reviews (
  id TEXT PRIMARY KEY,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  rating INT DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  image_url TEXT,
  is_anonymous BOOLEAN DEFAULT true NOT NULL,
  published BOOLEAN DEFAULT false NOT NULL,
  display_order INT DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.reviews IS '학부모 및 상담 신청자 이용 후기 목록 (관리자 승인 후 공개)';

-- RLS 활성화
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 익명 조회 허용 (공개 승인된 후기만)
CREATE POLICY "승인된 후기 익명 조회 허용"
ON public.reviews FOR SELECT
TO public
USING (published = true);

-- 일반 방문자의 신규 후기 등록 허용 (단, 무조건 미공개 상태로만 등록 가능)
CREATE POLICY "방문자 후기 미승인 등록 허용"
ON public.reviews FOR INSERT
TO public
WITH CHECK (published = false);

-- 관리자 전체 권한 허용
CREATE POLICY "관리자 후기 전체 관리 허용"
ON public.reviews FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 샘플 시드 데이터 3종 (공개 승인 상태로 시드)
INSERT INTO public.reviews (id, author_name, content, rating, is_anonymous, published, display_order)
VALUES
  ('rv-1', '김서연 어머니', '선생님 덕분에 아이가 눈을 마주치고 단어로 자기 의사를 표현하기 시작했어요. 따뜻하게 기다려 주시는 모습에 부모인 저도 큰 위로를 받았습니다.', 5, true, true, 1),
  ('rv-2', '이준호 아버님', '발음이 부정확해서 학교에서 위축되던 아이가 말자람터 치료 후 자신감을 되찾았습니다. 상담 기록도 꼼꼼히 공유해 주셔서 정말 안심이 됩니다.', 5, true, true, 2),
  ('rv-3', '박민지 학부모님', '주말 슬롯이 있어서 직장 다니면서도 아이 치료를 병행할 수 있어 감사했습니다. 시설도 굉장히 깨끗하고 따뜻한 분위기예요.', 5, true, true, 3)
ON CONFLICT (id) DO NOTHING;
