import { ADSENSE_CLIENT, adsEnabled } from "@/lib/ads";

export const dynamic = "force-static";

// AdSense 승인 시 요구되는 ads.txt. 게시자 ID가 설정돼야 유효한 내용을 반환.
export function GET() {
  if (!adsEnabled) {
    return new Response("", { headers: { "content-type": "text/plain" } });
  }
  // ca-pub-XXXX → pub-XXXX
  const publisherId = ADSENSE_CLIENT.replace(/^ca-/, "");
  const body = `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`;
  return new Response(body, { headers: { "content-type": "text/plain" } });
}
