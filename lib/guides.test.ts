import { describe, expect, it } from "vitest";
import { guides } from "./guides";
import nextConfig from "../next.config";

/**
 * 가이드 데이터가 조용히 망가지는 것을 막는 테스트.
 *
 * 2026-09-06에 29편을 20편으로 합쳤다. 애드센스가 "가치가 별로 없는 콘텐츠"로
 * 두 번 연속 반려했고, 이 노트는 "번호를 어떻게 골라도 확률은 같다"는 한 결론을
 * 네 편이 나눠 갖고 있었다. 그중 셋이 1,300자를 넘지 못했다.
 *
 * 안전 설계 원칙(CLAUDE.md)도 여기서 함께 지킨다 — 로또는 애드센스 도박 콘텐츠로
 * 분류되고, 위반하면 같은 퍼블리셔 ID의 다른 노트까지 위험하다.
 */

/** 화면에 실제로 나가는 본문 길이 (공백 제외) */
function bodyLength(g: (typeof guides)[number]): number {
  const parts = [
    ...g.intro,
    ...g.sections.flatMap((s) => [s.heading, ...s.paragraphs, ...(s.list ?? [])]),
    ...g.faq.flatMap((f) => [f.q, f.a]),
  ];
  return parts.join("").replace(/\s/g, "").length;
}

function fullText(g: (typeof guides)[number]): string {
  return [
    g.title,
    g.description,
    ...g.intro,
    ...g.sections.flatMap((s) => [s.heading, ...s.paragraphs, ...(s.list ?? [])]),
    ...g.faq.flatMap((f) => [f.q, f.a]),
  ].join("\n");
}

describe("가이드 데이터", () => {
  it("슬러그가 중복되지 않는다", () => {
    const seen = new Set<string>();
    const dup: string[] = [];
    for (const g of guides) {
      if (seen.has(g.slug)) dup.push(g.slug);
      seen.add(g.slug);
    }
    expect(dup).toEqual([]);
  });

  it("related가 실제 있는 글을 가리키고 자기 자신을 넣지 않는다", () => {
    const known = new Set(guides.map((g) => g.slug));
    const bad: string[] = [];
    for (const g of guides) {
      for (const r of g.related) {
        if (!known.has(r)) bad.push(`${g.slug} → 없는 글 ${r}`);
        if (r === g.slug) bad.push(`${g.slug} → 자기 자신`);
      }
      if (new Set(g.related).size !== g.related.length) {
        bad.push(`${g.slug}: related 중복`);
      }
    }
    expect(bad).toEqual([]);
  });

  it("본문이 1,500자 미만인 글이 없다", () => {
    // ⚠️ 기준이 두 가지라 헷갈리기 쉽다. 통합을 결정할 때 쓴 감사 수치는
    //    소스의 문자열 리터럴을 세는 느슨한 방식이었고, 여기 bodyLength는
    //    화면에 실제로 나가는 글자를 공백까지 빼고 센다.
    //    감사 기준 2,000자 ≈ 여기 1,500자다.
    const thin = guides
      .map((g) => ({ slug: g.slug, len: bodyLength(g) }))
      .filter((x) => x.len < 1500)
      .map((x) => `${x.slug} (${x.len}자)`);
    expect(thin).toEqual([]);
  });

  it("섹션 제목이 한 글 안에서 중복되지 않는다", () => {
    // 템플릿이 heading을 React key로 쓴다. 겹치면 렌더링이 깨진다.
    const bad: string[] = [];
    for (const g of guides) {
      const seen = new Set<string>();
      for (const s of g.sections) {
        if (seen.has(s.heading)) bad.push(`${g.slug}: "${s.heading}"`);
        seen.add(s.heading);
      }
    }
    expect(bad).toEqual([]);
  });

  it("FAQ 질문이 한 글 안에서 중복되지 않는다", () => {
    const bad: string[] = [];
    for (const g of guides) {
      const seen = new Set<string>();
      for (const f of g.faq) {
        if (seen.has(f.q)) bad.push(`${g.slug}: "${f.q}"`);
        seen.add(f.q);
      }
    }
    expect(bad).toEqual([]);
  });

  it("faq에는 ** 를 쓰지 않는다", () => {
    // FAQ는 JSON-LD 구조화 데이터로도 나가므로 태그가 아니라 별표가 그대로 들어간다.
    const bad = guides
      .filter((g) => g.faq.some((f) => f.q.includes("**") || f.a.includes("**")))
      .map((g) => g.slug);
    expect(bad).toEqual([]);
  });

  it("제목의 부제(— 뒤)가 서로 겹치지 않는다", () => {
    const bySub = new Map<string, string[]>();
    for (const g of guides) {
      const parts = g.title.split(" — ");
      if (parts.length < 2) continue;
      const sub = parts.slice(1).join(" — ").trim();
      bySub.set(sub, [...(bySub.get(sub) ?? []), g.slug]);
    }
    const dup = [...bySub.entries()]
      .filter(([, v]) => v.length > 1)
      .map(([k, v]) => `"${k}": ${v.join(", ")}`);
    expect(dup).toEqual([]);
  });

  it("cta가 실제 있는 페이지를 가리킨다", () => {
    const pages = new Set(["/numbers", "/stats", "/generator", "/check", "/stories"]);
    const bad = guides
      .filter((g) => g.cta && !pages.has(g.cta.href))
      .map((g) => `${g.slug} → ${g.cta!.href}`);
    expect(bad).toEqual([]);
  });
});

describe("안전 설계 원칙 (애드센스 계정 보호)", () => {
  it("예측·적중 보장 류 표현을 쓰지 않는다", () => {
    // CLAUDE.md 1번. 로또는 애드센스 도박 콘텐츠로 분류되고, 위반하면
    // 같은 퍼블리셔 ID의 다른 노트까지 위험하다.
    const banned = ["적중 보장", "당첨 보장", "무조건 1등", "확률이 높아집니다"];
    const bad: string[] = [];
    for (const g of guides) {
      const t = fullText(g);
      for (const w of banned) {
        if (t.includes(w)) bad.push(`${g.slug}: "${w}"`);
      }
    }
    expect(bad).toEqual([]);
  });

  it("확률을 높일 수 있다는 단언이 없다", () => {
    // ⚠️ '확률을 높이는' · '당첨을 예측' 같은 조각만 보고 거르면 안 된다.
    //    이 노트의 본문은 오히려 "확률을 높이는 장치가 아니라", "당첨을 예측하는
    //    방법이 아니라"처럼 **부정하는 문장에서 그 표현을 쓴다.** 실제로 처음
    //    이 테스트를 조각 매칭으로 짰다가 멀쩡한 문장 넷이 걸렸다.
    //    그래서 부정을 붙일 수 없는 **단언 형태만** 본다.
    const claims = [
      "확률을 높여줍니다",
      "확률을 높여 줍니다",
      "확률을 높일 수 있습니다",
      "당첨 확률이 올라갑니다",
      "당첨을 예측할 수 있습니다",
      "확실히 당첨",
    ];
    const bad: string[] = [];
    for (const g of guides) {
      const t = fullText(g);
      for (const w of claims) {
        if (t.includes(w)) bad.push(`${g.slug}: "${w}"`);
      }
    }
    expect(bad).toEqual([]);
  });

  it("과몰입 안내(1336)와 만 19세 고지가 가이드에 남아 있다", () => {
    // Footer에도 상시 노출되지만, 본문에서도 다루는 글이 있어야 한다.
    const with1336 = guides.filter((g) => fullText(g).includes("1336"));
    const withAge = guides.filter((g) => fullText(g).includes("만 19세"));
    expect(with1336.length).toBeGreaterThanOrEqual(5);
    expect(withAge.length).toBeGreaterThanOrEqual(5);
  });

  it("과세최저한을 200만원으로 쓴다", () => {
    // 복권 당첨금은 기타소득 일반 기준(건별 5만원)이 아니라 소득세법 제84조
    // 제1호의 건별 200만원 이하 비과세가 적용된다. 2026-09-06 점검에서
    // 네 편(tax·pension-lottery-compare·winner-anonymity·prize-amount-varies)이
    // 5만원으로 잘못 쓰고 있었고, tax에는 "3등 150만원 → 세금 33만원" 같은
    // 틀린 예시까지 있었다. 같은 노트의 lotto-scam·online-purchase-rules는
    // 200만원으로 맞게 쓰고 있어 한 노트 안에서 서로 어긋난 상태였다.
    // 되돌아가지 않도록 고정한다.
    const bad = guides
      .filter((g) => /5만원\s*이하[^.]{0,10}비과세/.test(fullText(g)))
      .map((g) => g.slug);
    expect(bad).toEqual([]);

    const tax = guides.find((g) => g.slug === "tax");
    expect(tax).toBeDefined();
    expect(fullText(tax!)).toContain("200만원 이하");
  });
});

describe("통합으로 사라진 URL의 301", () => {
  it("출발지는 사라진 글이고 목적지는 실재한다", async () => {
    const known = new Set(guides.map((g) => g.slug));
    const rules = await nextConfig.redirects!();
    expect(rules.length).toBe(9);

    const bad: string[] = [];
    for (const r of rules) {
      const from = r.source.replace("/guide/", "");
      const to = r.destination.replace("/guide/", "");
      if (known.has(from)) {
        bad.push(`${from}: 글이 살아 있는데 리다이렉트가 걸려 있음`);
      }
      if (!known.has(to)) bad.push(`${from} → ${to}: 목적지가 없음`);
      if (!r.permanent) bad.push(`${from}: 301이 아님`);
    }
    expect(bad).toEqual([]);
  });

  it("리다이렉트가 다시 리다이렉트로 이어지지 않는다", async () => {
    const rules = await nextConfig.redirects!();
    const sources = new Set(rules.map((r) => r.source));
    const chained = rules
      .filter((r) => sources.has(r.destination))
      .map((r) => `${r.source} → ${r.destination}`);
    expect(chained).toEqual([]);
  });
});
