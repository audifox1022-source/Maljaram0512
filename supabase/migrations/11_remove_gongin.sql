-- ============================================================================
-- 11_remove_gongin.sql
-- "공인 1급" 및 "1급" 관련 단어를 기존 데이터베이스에서 확인(SELECT)하고 수정(UPDATE)합니다.
-- ============================================================================

-- [먼저 확인: SELECT 문]
-- 1. site_sections 테이블에서 '공인' 글자가 포함된 행 조회
SELECT key, title, body 
FROM site_sections 
WHERE body LIKE '%공인%' OR title LIKE '%공인%';

-- 2. staff 테이블에서 '1급' 글자가 포함된 행 조회
SELECT id, name, role, bio 
FROM staff 
WHERE role LIKE '%1급%' OR bio LIKE '%1급%';


-- [수정 실행: UPDATE 문]
-- 1. 메인 히어로 섹션 본문 문구 수정 ("공인 1급 언어재활사" -> "검증된 전문 언어재활사")
UPDATE site_sections
SET body = REPLACE(body, '공인 1급 언어재활사와', '검증된 전문 언어재활사와')
WHERE key = 'hero' AND body LIKE '%공인 1급%';

-- 2. 김지수 원장 프로필 직책 및 약력 수정 ("(1급)" 제거 및 "보건복지부 1급 언어재활사" -> "보건복지부 전문 언어재활사")
UPDATE staff
SET 
  role = REPLACE(role, ' (1급)', ''),
  bio = REPLACE(bio, '1급 언어재활사', '전문 언어재활사')
WHERE name = '김지수 원장' OR role LIKE '%1급%' OR bio LIKE '%1급%';

-- [수정 완료 후 최종 확인]
SELECT key, title, body FROM site_sections WHERE key = 'hero';
SELECT id, name, role, bio FROM staff WHERE name = '김지수 원장';
