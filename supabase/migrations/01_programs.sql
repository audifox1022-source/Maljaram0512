-- ==========================================================
-- 말자람터 언어심리연구소: 프로그램 테이블 생성 및 RLS 설정
-- ==========================================================
-- 이 스크립트를 Supabase 대시보드의 [SQL Editor]에 복사하여 붙여넣고 [Run] 하세요.

-- 1. 프로그램 테이블 생성
CREATE TABLE IF NOT EXISTS public.programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  target TEXT NOT NULL,
  summary TEXT NOT NULL,
  description TEXT NOT NULL,
  effect TEXT NOT NULL,
  process TEXT NOT NULL,
  image_url TEXT,
  display_order INT DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 코멘트 추가 (관리자 대시보드에서 파악하기 쉽게)
COMMENT ON TABLE public.programs IS '센터에서 제공하는 치료 및 평가 프로그램 목록';
COMMENT ON COLUMN public.programs.slug IS 'URL 경로로 사용할 고유 식별자 (예: language-evaluation)';
COMMENT ON COLUMN public.programs.display_order IS '화면 노출 순서 (숫자가 작을수록 먼저 노출)';
COMMENT ON COLUMN public.programs.published IS '공개 여부 (true일 때만 학부모용 공개 사이트에 노출)';

-- 2. Row Level Security (RLS) 활성화
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;

-- 3. RLS 정책 설정
-- 3-1. 공개 읽기 정책: 누구나(익명 포함) published=true인 데이터 읽기 가능
CREATE POLICY "공개된 프로그램은 누구나 조회 가능" 
  ON public.programs 
  FOR SELECT 
  USING (published = true);

-- 3-2. 관리자 쓰기 정책: 로그인한 관리자(authenticated)는 모든 작업 가능
CREATE POLICY "관리자는 프로그램 삽입 가능" 
  ON public.programs 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "관리자는 프로그램 수정 가능" 
  ON public.programs 
  FOR UPDATE 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "관리자는 프로그램 삭제 가능" 
  ON public.programs 
  FOR DELETE 
  TO authenticated 
  USING (true);


-- 4. 샘플 시드 데이터 삽입 (초기 더미 데이터)
INSERT INTO public.programs (slug, title, target, summary, description, effect, process, image_url, display_order, published)
VALUES
(
  'language-evaluation',
  '종합 언어발달 평가',
  '말이 또래보다 늦거나 발음에 어려움이 있는 영유아 및 아동',
  '공인된 표준화 검사와 행동 관찰을 통해 아이의 현재 언어 수용 및 표현 수준을 정확하게 파악합니다.',
  '아이의 언어 연령과 현재 발달 단계를 다각도로 분석하는 필수 초기 과정입니다. 부모님과의 심층 면담을 통해 가정 내 의사소통 환경을 점검하고, 검사 후에는 결과에 대한 구체적인 피드백과 앞으로의 맞춤형 치료 로드맵을 제시합니다.',
  '• 또래 대비 정확한 언어 발달 지표 확인\n• 아이의 언어적 강점과 보완점 발견\n• 맞춤형 언어치료 목표 수립의 근거 마련',
  '1단계: 초기 부모 면담 및 배경 정보 조사\n2단계: 표준화 검사 실시 (PRES, SELSI, REVT 등)\n3단계: 검사 결과 분석 및 보고서 작성\n4단계: 부모 피드백 상담 및 치료 방향 안내',
  'https://picsum.photos/seed/prog-eval/800/600',
  1,
  true
),
(
  'articulation-therapy',
  '조음 및 발음 치료',
  '특정 발음이 부정확하거나 말이 얼버무려져 전달력이 떨어지는 아동',
  '말소리를 만드는 기관의 움직임을 훈련하여 정확하고 명료하게 발음할 수 있도록 돕습니다.',
  '아이가 "ㅅ, ㄹ, ㅋ" 등 특정 말소리를 내기 어려워하거나, 혀의 위치가 올바르지 않아 발음이 뭉개지는 경우에 적합합니다. 체계적인 조음 훈련과 재미있는 놀이 활동을 연계하여 아이가 스트레스 없이 스스로 정확한 발음을 습득하도록 돕습니다.',
  '• 전달력 있는 명료한 발음 획득\n• 자신의 말에 대한 자신감 향상\n• 학령기 일기 및 쓰기 장애 예방 효과',
  '1단계: 조음기관 평가 및 오류 음소 파악\n2단계: 단음소 및 청각적 분별 훈련\n3단계: 단어 및 문장 단위 발음 연습\n4단계: 일상 대화에서의 일반화 훈련',
  'https://picsum.photos/seed/prog-articulation/800/600',
  2,
  true
),
(
  'cognitive-learning',
  '인지·학습 언어치료',
  '주의 집중력이 낮거나 문장의 의미 이해, 상황 맥락 파악이 어려운 아동',
  '언어적 사고력과 문제 해결 능력을 키워 학습의 기초가 되는 인지적 바탕을 단단하게 만듭니다.',
  '단순한 단어 암기가 아닌, 상황을 논리적으로 이해하고 자신의 생각을 체계적으로 표현하는 능력을 기릅니다. 어휘력 확장, 스토리텔링 훈련, 추론 능력 강화 활동을 통해 학교 수업에 대한 적응력과 자기주도적 학습 능력을 높입니다.',
  '• 논리적 표현력 및 문장 이해력 향상\n• 과제 수행 시 주의 집중 시간 연장\n• 또래 관계에서의 상황 판단력 증진',
  '1단계: 기초 인지 및 학습 능력 파악\n2단계: 핵심 어휘 및 개념 형성 훈련\n3단계: 원인-결과 추론 및 문제 해결 놀이\n4단계: 학교 교과 과정 연계 언어 활동',
  'https://picsum.photos/seed/prog-cognitive/800/600',
  3,
  true
),
(
  'parent-counseling',
  '부모 상담 및 의사소통 코칭',
  '아이의 언어 발달 촉진을 위해 올바른 상호작용 방법을 배우고 싶은 보호자',
  '가장 긴 시간을 함께하는 부모님이 아이의 가장 훌륭한 대화 파트너가 되실 수 있도록 일상 속 대화 전략을 코칭합니다.',
  '주 1~2회 치료실에서의 시간만으로는 아이를 완전히 변화시키기 어렵습니다. 부모님이 가정에서 아이와 어떻게 눈을 맞추고, 어떤 반응을 보여주어야 하는지 구체적인 솔루션을 제공합니다. 육아 스트레스 해소와 양육 효능감 향상도 함께 이루어집니다.',
  '• 가정 내 자연스러운 언어 자극 환경 구축\n• 부모-자녀 간 긍정적 애착 관계 강화\n• 양육 스트레스 감소 및 소통 능력 향상',
  '1단계: 부모-자녀 상호작용 비디오 관찰 분석\n2단계: 맞춤형 상호작용 피드백 및 솔루션 제시\n3단계: 가정 내 실천 과제 부여 및 롤플레잉\n4단계: 정기 코칭 세션을 통한 점검',
  'https://picsum.photos/seed/prog-parent/800/600',
  4,
  true
)
ON CONFLICT (slug) DO NOTHING;
