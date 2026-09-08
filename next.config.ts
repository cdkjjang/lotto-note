import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 보안 헤더 — 콘텐츠나 광고 동작에는 영향을 주지 않는다.
  // HSTS와 HTTPS 리다이렉트는 Vercel이 처리하므로 여기서는 세 가지만 둔다.
  // X-Frame-Options는 SAMEORIGIN — 광고는 우리 페이지 '안에' 들어오는
  // iframe이라 이 헤더의 영향을 받지 않는다.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // 이 사이트는 카메라·마이크·위치·결제를 쓰지 않는다. 명시적으로 꺼 두면
          // 광고 iframe을 포함한 하위 프레임에서도 요청할 수 없다.
          // 애드센스가 쓰는 기능이 아니라 광고 게재에 영향이 없다.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
          },
        ],
      },
    ];
  },

  // 2026-09-06 가이드 통합으로 사라진 슬러그 → 흡수한 글로 301.
  //
  // permanent: true는 308로 나가고 구글은 301과 같게 처리한다.
  // **이 목록을 지우지 말 것.** 지우는 순간 옛 URL이 404가 된다.
  //
  // 29편 중 9편이 옆 글에 흡수됐다. "번호를 어떻게 골라도 확률은 같다"는 한 결론을
  // 네 편이 나눠 갖고 있었고 그중 셋이 1,300자를 넘지 못했다. 이런 구조가
  // 애드센스 재반려의 원인 중 하나였다(워크스페이스 CLAUDE.md 8장).
  async redirects() {
    const merged: Record<string, string> = {
      // → 번호 고르는 법 (자동·수동, 통계, 많이 나온 번호)
      "statistics-myth": "/guide/how-to-pick",
      "most-frequent-numbers": "/guide/how-to-pick",
      "auto-manual": "/guide/how-to-pick",
      // → 확률 완전 정리 (많이 사면 확률도 손실도 10배)
      "buying-more-odds": "/guide/odds",
      // → 당첨금 수령 (기한 1년과 미수령)
      "unclaimed-prize": "/guide/claim",
      // → 명당의 진실 (판매점은 확률에 관여할 수 없다)
      "store-license": "/guide/winning-store",
      // → 처음 사는 법 (온라인 회차당 5천원 한도 포함)
      "online-purchase-rules": "/guide/how-to-buy",
      // → 판매액과 복권기금 (2002년 1회차부터의 제도 변화 포함)
      history: "/guide/lottery-fund",
      // → 사기 수법과 재미로 즐기는 기준 (예산·과몰입 신호)
      "responsible-play": "/guide/lotto-scam",
    };

    return Object.entries(merged).map(([from, to]) => ({
      source: `/guide/${from}`,
      destination: to,
      permanent: true,
    }));
  },
};

export default nextConfig;
