"use client";

import { useEffect } from "react";
import { ADSENSE_CLIENT, adsEnabled } from "@/lib/ads";

const isDev = process.env.NODE_ENV !== "production";

/**
 * 단일 광고 단위.
 * - 게시자 ID와 슬롯 ID가 모두 있으면 실제 AdSense 광고를 렌더.
 * - 미설정 시: 개발 환경에서는 안내용 placeholder, 운영에서는 아무것도 렌더하지 않음.
 */
export function AdUnit({
  slot,
  format = "auto",
  className = "",
}: {
  slot: string;
  format?: string;
  className?: string;
}) {
  const active = adsEnabled && slot.length > 0;

  useEffect(() => {
    if (!active) return;
    try {
      // @ts-expect-error adsbygoogle is injected by the AdSense script
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* 광고 차단기 등으로 실패해도 무시 */
    }
  }, [active]);

  if (!active) {
    if (!isDev) return null;
    return (
      <div
        className={`my-4 flex h-24 items-center justify-center rounded-2xl border border-dashed border-slate-300 text-xs text-slate-400 dark:border-[#3A3A3C] ${className}`}
      >
        광고 영역 (AdSense 미설정 · slot: {slot || "없음"})
      </div>
    );
  }

  return (
    <div className={`my-4 ${className}`}>
      <p className="mb-1 text-center text-[10px] uppercase tracking-wider text-slate-300">
        광고
      </p>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
