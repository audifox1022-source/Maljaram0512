"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Bell } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { Banner } from "@/lib/supabase/banners";

export function PopupModal({ banners }: { banners: Banner[] }) {
  const [open, setOpen] = useState(false);
  const [hideToday, setHideToday] = useState(false);
  const [activePopup, setActivePopup] = useState<Banner | null>(null);

  useEffect(() => {
    if (!banners || banners.length === 0) return;
    const first = banners[0];

    const todayStr = new Date().toDateString();
    const hiddenStr = localStorage.getItem(`hide_popup_${first.id}`);

    if (hiddenStr !== todayStr) {
      setActivePopup(first);
      setOpen(true);
    }
  }, [banners]);

  if (!activePopup) return null;

  const handleClose = () => {
    if (hideToday) {
      const todayStr = new Date().toDateString();
      localStorage.setItem(`hide_popup_${activePopup.id}`, todayStr);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && handleClose()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-3xl border-0 shadow-2xl">
        <DialogHeader className="p-6 pb-2 text-left bg-gradient-to-b from-[var(--color-brand-cream)] to-background">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[var(--color-brand-teal)]">
              <Bell className="h-5 w-5 animate-bounce" />
              <span className="text-xs font-bold uppercase tracking-wider">안내 공지사항</span>
            </div>
          </div>
          <DialogTitle className="text-xl font-bold mt-2 text-[var(--color-brand-teal)] leading-snug">
            {activePopup.title}
          </DialogTitle>
        </DialogHeader>

        {/* 팝업 본문 사진 또는 내용 */}
        <div className="px-6 py-4">
          {activePopup.image_url && activePopup.image_url !== "/file.svg" ? (
            <div className="rounded-2xl overflow-hidden mb-4 max-h-60 bg-muted">
              <img src={activePopup.image_url} alt="공지 이미지" className="w-full h-auto object-cover" />
            </div>
          ) : null}

          <p className="text-sm text-muted-foreground leading-relaxed">
            언어심리 연구소 방문 전 사전 예약 및 공지 일정을 확인해 주시기 바랍니다. 친절하고 자세하게 안내해 드리겠습니다.
          </p>
        </div>

        <DialogFooter className="p-4 bg-muted/60 flex flex-row items-center justify-between border-t border-border sm:justify-between gap-2">
          <div className="flex items-center space-x-2 pl-2">
            <Checkbox
              id="hideToday"
              checked={hideToday}
              onCheckedChange={(checked) => setHideToday(Boolean(checked))}
              className="rounded"
            />
            <label htmlFor="hideToday" className="text-xs font-medium text-muted-foreground cursor-pointer select-none">
              오늘 하루 동안 보지 않기
            </label>
          </div>

          <div className="flex gap-2">
            {activePopup.link_url && (
              <Link
                href={activePopup.link_url}
                onClick={handleClose}
                className="inline-flex items-center justify-center rounded-xl bg-[var(--color-brand-teal)] px-4 py-2 text-xs font-bold text-white shadow hover:bg-[var(--color-brand-teal)]/90 transition-all"
              >
                상세보기
              </Link>
            )}
            <Button type="button" variant="outline" size="sm" onClick={handleClose} className="rounded-xl text-xs font-bold">
              닫기
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
