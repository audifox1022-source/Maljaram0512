-- ==========================================================
-- 말자람터 언어심리연구소: 온라인 문의(inquiries) 및 알림 로그 테이블 생성
-- ==========================================================
-- 이 스크립트를 Supabase 대시보드의 [SQL Editor]에 붙여넣고 [Run] 하세요.

-- 1. 온라인 문의(inquiries) 테이블 생성
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new'::text NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.inquiries IS '학부모 온라인 상담 문의 내역';
COMMENT ON COLUMN public.inquiries.status IS '처리 상태 (new: 신규 접수, in_progress: 확인/상담중, completed: 완료)';

-- 2. 문의 테이블 RLS 활성화 및 정책 설정
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- 익명 방문자를 포함한 누구나 문의 남기기(INSERT) 허용
CREATE POLICY "누구나 문의 접수 가능" 
  ON public.inquiries 
  FOR INSERT 
  TO public
  WITH CHECK (true);

-- 문의 목록 조회 및 상태 변경은 로그인한 관리자(authenticated)만 허용
CREATE POLICY "관리자만 문의 조회 가능" 
  ON public.inquiries 
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "관리자만 문의 수정 가능" 
  ON public.inquiries 
  FOR UPDATE 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "관리자만 문의 삭제 가능" 
  ON public.inquiries 
  FOR DELETE 
  TO authenticated 
  USING (true);


-- 3. 알림 발송 로그(notification_logs) 테이블 생성
CREATE TABLE IF NOT EXISTS public.notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  recipient TEXT,
  status TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.notification_logs IS '시스템 알림 발송 시뮬레이션 및 발송 이력 로그';

-- 4. 알림 로그 테이블 RLS 활성화 및 정책 설정
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

-- 익명 클라이언트에서 직접 조작 금지. 조회는 관리자만 허용
CREATE POLICY "관리자만 알림 로그 조회 가능" 
  ON public.notification_logs 
  FOR SELECT 
  TO authenticated 
  USING (true);

-- 백엔드 서버(Service Role 혹은 누구나 API를 통해) 기록 가능하게 하려면 아래 정책 적용
CREATE POLICY "서버 로직에서 알림 로그 기록 가능" 
  ON public.notification_logs 
  FOR INSERT 
  TO public
  WITH CHECK (true);
