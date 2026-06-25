import { getAllPrograms } from "@/lib/supabase/programs";
import { ProgramsAdmin } from "./ProgramsAdmin";

export const dynamic = "force-dynamic";

export default async function AdminProgramsPage() {
  const list = await getAllPrograms();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-card p-6 md:p-8 rounded-3xl border border-border shadow-xs">
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: "var(--color-brand-teal)" }}>
          언어·심리 치료 프로그램 안내 관리
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          제공하는 검사 및 프로그램의 요약 설명과 진행 방식, 효과 등을 직접 수정하고 홈페이지 노출 여부를 제어합니다.
        </p>
      </div>

      <ProgramsAdmin initialList={list} />
    </div>
  );
}
