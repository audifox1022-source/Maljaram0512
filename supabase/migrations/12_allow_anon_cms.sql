-- ============================================================================
-- 12_allow_anon_cms.sql (안전 버전)
-- 테이블이 아직 생성되지 않은 경우 에러 없이 부드럽게 건너뛰도록 보호 처리되었습니다.
-- ============================================================================

DO $$ 
BEGIN
  BEGIN EXECUTE 'CREATE POLICY "체험 CMS 쓰기 개방_settings" ON public.site_settings FOR ALL TO public USING (true) WITH CHECK (true)'; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN EXECUTE 'CREATE POLICY "체험 CMS 쓰기 개방_sections" ON public.site_sections FOR ALL TO public USING (true) WITH CHECK (true)'; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN EXECUTE 'CREATE POLICY "체험 CMS 쓰기 개방_staff" ON public.staff FOR ALL TO public USING (true) WITH CHECK (true)'; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN EXECUTE 'CREATE POLICY "체험 CMS 쓰기 개방_programs" ON public.programs FOR ALL TO public USING (true) WITH CHECK (true)'; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN EXECUTE 'CREATE POLICY "체험 CMS 쓰기 개방_faqs" ON public.faqs FOR ALL TO public USING (true) WITH CHECK (true)'; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN EXECUTE 'CREATE POLICY "체험 CMS 쓰기 개방_menus" ON public.nav_menus FOR ALL TO public USING (true) WITH CHECK (true)'; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN EXECUTE 'CREATE POLICY "체험 CMS 쓰기 개방_banners" ON public.banners FOR ALL TO public USING (true) WITH CHECK (true)'; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN EXECUTE 'CREATE POLICY "체험 CMS 쓰기 개방_reviews" ON public.reviews FOR ALL TO public USING (true) WITH CHECK (true)'; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN EXECUTE 'CREATE POLICY "체험 CMS 쓰기 개방_posts" ON public.posts FOR ALL TO public USING (true) WITH CHECK (true)'; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN EXECUTE 'CREATE POLICY "체험 CMS 쓰기 개방_gallery" ON public.gallery_items FOR ALL TO public USING (true) WITH CHECK (true)'; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN EXECUTE 'CREATE POLICY "체험 CMS 쓰기 개방_seo" ON public.page_seo FOR ALL TO public USING (true) WITH CHECK (true)'; EXCEPTION WHEN OTHERS THEN NULL; END;
END $$;
