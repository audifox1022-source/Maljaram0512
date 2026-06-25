-- ==========================================================
-- 말자람터 언어심리연구소: 상담사, 예약 슬롯, 예약 테이블 및 동시성 제어 RPC
-- ==========================================================
-- 이 스크립트를 Supabase 대시보드의 [SQL Editor]에 복사하여 실행하세요.

-- 1. 상담사(counselors) 테이블
CREATE TABLE IF NOT EXISTS public.counselors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.counselors IS '상담 및 치료를 담당하는 전문가 목록';

-- 2. 가용 예약 슬롯(availability_slots) 테이블
CREATE TABLE IF NOT EXISTS public.availability_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  counselor_id UUID REFERENCES public.counselors(id) ON DELETE CASCADE NOT NULL,
  slot_start TIMESTAMPTZ NOT NULL,
  slot_end TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'open'::text NOT NULL CHECK (status IN ('open', 'booked', 'closed')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.availability_slots IS '상담사가 상담 가능한 날짜 및 시간대 슬롯 (open: 예약가능, booked: 예약완료, closed: 마감)';
CREATE INDEX IF NOT EXISTS idx_slots_start_status ON public.availability_slots(slot_start, status);

-- 3. 상담 예약 신청(reservations) 테이블
CREATE TABLE IF NOT EXISTS public.reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id UUID REFERENCES public.availability_slots(id) ON DELETE RESTRICT NOT NULL,
  counselor_id UUID REFERENCES public.counselors(id) ON DELETE RESTRICT NOT NULL,
  consult_type TEXT NOT NULL,
  applicant_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  child_info TEXT NOT NULL,
  status TEXT DEFAULT 'requested'::text NOT NULL CHECK (status IN ('requested', 'confirmed', 'canceled', 'done')),
  admin_memo TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.reservations IS '학부모가 제출한 초기 상담 예약 내역';

-- 4. RLS 활성화
ALTER TABLE public.counselors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- 4-1. 읽기 정책: 누구나 활성화된 상담사와 미래의 open 슬롯 조회 가능
CREATE POLICY "활성 상담사 조회 가능" ON public.counselors FOR SELECT USING (active = true);
CREATE POLICY "오픈된 예약 슬롯 조회 가능" ON public.availability_slots FOR SELECT USING (status = 'open' AND slot_start > now());

-- 4-2. 예약 테이블 삽입 허용 (일반적으로는 아래 RPC 함수를 통해 안전하게 삽입됨)
CREATE POLICY "누구나 예약 신청 가능" ON public.reservations FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "관리자만 예약 관리 가능" ON public.reservations FOR ALL TO authenticated USING (true);


-- 5. ★ 중복 예약 방지를 위한 트랜잭션 RPC 함수 (동시성 제어 핵심)
-- 다수의 학부모가 동시에 같은 슬롯에 예약 요청을 보낼 때, 
-- FOR UPDATE 행 잠금을 통해 정확히 선착순 1명만 예약되고 나머지는 마감 안내를 받습니다.
CREATE OR REPLACE FUNCTION public.book_consultation_slot(
  p_slot_id UUID,
  p_consult_type TEXT,
  p_applicant_name TEXT,
  p_phone TEXT,
  p_email TEXT,
  p_child_info TEXT
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- RLS를 우회하여 슬롯 상태 업데이트 및 예약 삽입을 한 트랜잭션 내에서 처리
AS $$
DECLARE
  v_slot public.availability_slots%ROWTYPE;
  v_res_id UUID;
BEGIN
  -- 해당 슬롯을 FOR UPDATE(배타적 잠금)로 획득하여 다른 동시 요청이 접근하지 못하도록 대기시킴
  SELECT * INTO v_slot 
  FROM public.availability_slots 
  WHERE id = p_slot_id 
  FOR UPDATE;

  -- 슬롯이 존재하지 않거나 이미 마감(booked/closed)된 경우 실패 반환
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', '존재하지 않는 예약 슬롯입니다.');
  END IF;

  IF v_slot.status <> 'open' THEN
    RETURN jsonb_build_object('success', false, 'error', '방금 전 다른 분의 신청이 완료되어 마감된 시간대입니다. 다른 시간을 선택해주세요.');
  END IF;

  -- 1. 슬롯 상태를 예약완료('booked')로 변경
  UPDATE public.availability_slots 
  SET status = 'booked' 
  WHERE id = p_slot_id;

  -- 2. 예약 내역 생성
  INSERT INTO public.reservations (
    slot_id,
    counselor_id,
    consult_type,
    applicant_name,
    phone,
    email,
    child_info,
    status
  ) VALUES (
    p_slot_id,
    v_slot.counselor_id,
    p_consult_type,
    p_applicant_name,
    p_phone,
    p_email,
    p_child_info,
    'requested'
  ) RETURNING id INTO v_res_id;

  -- 성공 응답 반환
  RETURN jsonb_build_object('success', true, 'reservation_id', v_res_id);
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'error', '서버 처리 중 오류가 발생했습니다: ' || SQLERRM);
END;
$$;


-- 6. 샘플 시드 데이터 삽입 (언제 스크립트를 실행해도 다음 2주간 평일 슬롯 생성)
DO $$
DECLARE
  v_counselor1 UUID;
  v_counselor2 UUID;
  v_date DATE;
  v_day_of_week INT;
BEGIN
  -- 상담사 2명 삽입
  INSERT INTO public.counselors (name, active) VALUES ('김지수 원장', true) RETURNING id INTO v_counselor1;
  INSERT INTO public.counselors (name, active) VALUES ('박서연 수석 치료사', true) RETURNING id INTO v_counselor2;

  -- 오늘 기준 +1일부터 +14일까지 평일(월~금) 하루 3개 슬롯 자동 생성
  FOR i IN 1..14 LOOP
    v_date := CURRENT_DATE + i;
    v_day_of_week := EXTRACT(ISODOW FROM v_date); -- 1:월, 2:화 ... 6:토, 7:일

    -- 평일(월~금)일 때만 슬롯 생성
    IF v_day_of_week <= 5 THEN
      -- 오전 10:00 ~ 11:00 (김지수 원장)
      INSERT INTO public.availability_slots (counselor_id, slot_start, slot_end, status)
      VALUES (v_counselor1, (v_date || ' 10:00:00+09')::TIMESTAMPTZ, (v_date || ' 11:00:00+09')::TIMESTAMPTZ, 'open');

      -- 오후 14:00 ~ 15:00 (박서연 치료사)
      INSERT INTO public.availability_slots (counselor_id, slot_start, slot_end, status)
      VALUES (v_counselor2, (v_date || ' 14:00:00+09')::TIMESTAMPTZ, (v_date || ' 15:00:00+09')::TIMESTAMPTZ, 'open');

      -- 오후 16:00 ~ 17:00 (김지수 원장)
      INSERT INTO public.availability_slots (counselor_id, slot_start, slot_end, status)
      VALUES (v_counselor1, (v_date || ' 16:00:00+09')::TIMESTAMPTZ, (v_date || ' 17:00:00+09')::TIMESTAMPTZ, 'open');
    END IF;
  END LOOP;
END $$;
