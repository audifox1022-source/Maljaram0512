-- ============================================================================
-- 12_allow_anon_cms.sql
-- 체험판 CMS(초보자 체험 모드)에서 서비스 롤 키(Service Role Key) 없이도
-- 관리자 페이지 수정 사항이 Supabase DB에 즉시 저장되도록 RLS 쓰기 권한을 개방합니다.
-- ============================================================================

-- 기존 정책 충돌 방지를 위해 DROP 후 생성 혹은 익명 전용 허용 정책 추가
CREATE POLICY "체험 CMS 쓰기 개방_settings" ON public.site_settings FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "체험 CMS 쓰기 개방_sections" ON public.site_sections FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "체험 CMS 쓰기 개방_staff" ON public.staff FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "체험 CMS 쓰기 개방_programs" ON public.programs FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "체험 CMS 쓰기 개방_faqs" ON public.faqs FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "체험 CMS 쓰기 개방_menus" ON public.nav_menus FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "체험 CMS 쓰기 개방_banners" ON public.banners FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "체험 CMS 쓰기 개방_reviews" ON public.reviews FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "체험 CMS 쓰기 개방_posts" ON public.posts FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "체험 CMS 쓰기 개방_gallery" ON public.gallery_items FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "체험 CMS 쓰기 개방_seo" ON public.page_seo FOR ALL TO public USING (true) WITH CHECK (true);
