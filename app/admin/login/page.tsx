"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Lock, ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/admin";

  const [email, setEmail] = useState("admin@maljarumter.com");
  const [password, setPassword] = useState("12341234");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("운영진 인증에 성공했습니다!");
        router.push(redirectPath);
        router.refresh();
      } else {
        toast.error(data.error || "로그인에 실패했습니다.");
      }
    } catch {
      toast.error("인증 서버 통신 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted/20">
      <div className="max-w-md w-full space-y-8 bg-card p-8 sm:p-10 rounded-3xl border border-border shadow-lg">
        <div className="text-center">
          <div
            className="mx-auto h-16 w-16 rounded-2xl flex items-center justify-center mb-4 shadow-sm"
            style={{ background: "var(--color-brand-green-light)" }}
          >
            <ShieldCheck className="h-9 w-9 text-[var(--color-brand-green)]" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground" style={{ color: "var(--color-brand-teal)" }}>
            운영진 전용 로그인
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            말자람터 언어심리연구소 공식 홈페이지 CMS 시스템
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-bold">
                관리자 이메일
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-xl font-mono"
                placeholder="admin@maljarumter.com"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-bold">
                비밀번호
              </Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-xl"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--color-brand-cream)] border border-border text-xs text-muted-foreground flex items-center gap-2">
            <Lock className="h-4 w-4 text-[var(--color-brand-teal)] shrink-0" />
            <span>초보자 체험 모드: 어떤 비번을 입력하셔도 안전하게 로그인 테스트가 가능합니다.</span>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-full text-base font-bold shadow-md hover:shadow-lg transition-all"
            style={{ background: "var(--color-brand-teal)", color: "white" }}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                인증 확인 중...
              </>
            ) : (
              "관리자 대시보드 입장하기"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[var(--color-brand-green)]" /></div>}>
      <LoginContent />
    </Suspense>
  );
}
