// SNS(카톡·스레드 등) 공유 시 표시되는 OG 이미지 — 빌드 시 정적 생성
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "로또노트 — 회차별 당첨번호와 번호별 통계";

const TITLE = "1회부터 최신 회차까지";
const SUB = "당첨번호 조회 · 번호별 통계 · 번호 생성기 · 당첨 확인";
const BRAND = "로또노트";

// Google Fonts에서 사용된 글자만 서브셋으로 받아 임베드 (satori는 woff2 미지원 → ttf/otf 요청)
async function loadKoreanFont(text: string): Promise<ArrayBuffer> {
  const css = await (
    await fetch(
      `https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@700&text=${encodeURIComponent(text)}`
    )
  ).text();
  const match = css.match(/src:\s*url\((.+?)\)\s*format\('(?:truetype|opentype|woff)'\)/);
  if (!match) throw new Error("OG 이미지용 폰트 URL을 찾지 못했습니다");
  return await (await fetch(match[1])).arrayBuffer();
}

export default async function OpengraphImage() {
  const font = await loadKoreanFont(TITLE + SUB + BRAND);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage:
            "linear-gradient(135deg, #1f3a5f 0%, #2f5c8f 60%, #4179b5 100%)",
          fontFamily: "NotoSansKR",
          color: "#ffffff",
        }}
      >
        <div style={{ fontSize: 66, fontWeight: 700, letterSpacing: -2 }}>
          {TITLE}
        </div>
        <div style={{ marginTop: 28, fontSize: 27, opacity: 0.9 }}>{SUB}</div>
        <div
          style={{
            marginTop: 54,
            display: "flex",
            alignItems: "center",
            backgroundColor: "#ffffff",
            color: "#1f3a5f",
            fontSize: 34,
            fontWeight: 700,
            padding: "14px 44px",
            borderRadius: 999,
          }}
        >
          {BRAND}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "NotoSansKR", data: font, weight: 700, style: "normal" }],
    }
  );
}
