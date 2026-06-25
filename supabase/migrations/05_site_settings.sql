-- ==========================================================
-- 말자람터 언어심리연구소: 사이트 기본설정(싱글톤) 마이그레이션
-- ==========================================================

CREATE TABLE IF NOT EXISTS public.site_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- 단 1개의 행만 존재하도록 제약
  site_name TEXT DEFAULT '말자람터 언어심리연구소' NOT NULL,
  logo_url TEXT DEFAULT '/file.svg' NOT NULL,
  phone TEXT DEFAULT '02-1234-5678' NOT NULL,
  address TEXT DEFAULT '서울특별시 중구 세종대로 110 말자람터 빌딩 2층' NOT NULL,
  business_hours TEXT DEFAULT '평일 10:00 - 19:00 | 토요일 09:00 - 15:00 (일요일/공휴일 휴무)' NOT NULL,
  email TEXT DEFAULT 'info@maljarumter.com' NOT NULL,
  kakao_url TEXT DEFAULT 'https://pf.kakao.com/' NOT NULL,
  instagram_url TEXT DEFAULT 'https://instagram.com/' NOT NULL,
  blog_url TEXT DEFAULT 'https://blog.naver.com/' NOT NULL,
  youtube_url TEXT DEFAULT 'https://youtube.com/' NOT NULL,
  map_embed TEXT DEFAULT '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3162.275038330761!2d126.9768822!3d37.566535!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca2eb421c44ad%3A0xe955a50c118085f8!2z7I2c7Jq47Yq567OE7IucIOyEseuPmeuMgOmmvCAxMTA!5e0!3m2!1sko!2skr!4v1700000000000!5m2!1sko!2skr" width="100%" height="400" style="border:0;" allowfullscreen="" loading="lazy"></iframe>' NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.site_settings IS '센터 공식 홈페이지 전역 로고·연락처·SNS·지도 기본 설정';

-- RLS 활성화
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 익명 읽기 허용
CREATE POLICY "사이트 기본설정 익명 조회 허용"
ON public.site_settings FOR SELECT
TO public
USING (true);

-- 관리자 쓰기 허용
CREATE POLICY "관리자만 사이트 기본설정 수정 가능"
ON public.site_settings FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 기본 싱글톤 데이터 시드 (id = 1)
INSERT INTO public.site_settings (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;
