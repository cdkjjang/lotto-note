import type { Metadata } from "next";
import { LottoBall } from "@/components/LottoBall";
import AdSlot from "@/components/AdSlot";
import CalcNotes from "@/components/CalcNotes";
import { draws, latestDraw, TOTAL_ROUNDS } from "@/lib/draws";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import {
  ALL_NUMBERS,
  coldNumbers,
  frequencyMap,
  hotNumbers,
  lowCountDistribution,
  oddCountDistribution,
  roundsSinceLast,
} from "@/lib/stats";

export const metadata: Metadata = {
  alternates: { canonical: "/stats" },
  title: "로또 번호별 통계 — 많이 나온 번호·미출현 기간",
  description:
    "로또 6/45 전 회차 기준 번호별 출현 횟수, 많이/적게 나온 번호, 오래 안 나온 번호, 홀짝·고저 비율 통계입니다. 예측이 아닌 과거 데이터 집계입니다.",
};

function Bar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <span className="block h-2 w-full rounded-full bg-border-soft/70">
      <span
        className="block h-2 rounded-full bg-accent"
        style={{ width: `${pct}%` }}
      />
    </span>
  );
}

export default function StatsPage() {
  // 검색결과에 "사이트명 > 도구명" 경로가 표시되도록 한다.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "번호별 통계" },
    ],
  };

  const hot = hotNumbers(draws, 8);
  const cold = coldNumbers(draws, 8);
  const map = frequencyMap(draws);
  const maxCount = Math.max(...map);
  const since = roundsSinceLast(draws);
  const longestGaps = ALL_NUMBERS.map((n) => ({ number: n, gap: since[n] }))
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 8);
  const oddDist = oddCountDistribution(draws);
  const lowDist = lowCountDistribution(draws);

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="text-2xl font-extrabold">로또 번호별 통계</h1>
      <p className="mt-2 text-muted">
        제1회부터 제{latestDraw.round}회까지 총{" "}
        {TOTAL_ROUNDS.toLocaleString()}회차 기준입니다.
      </p>

      {/* 예측 아님 고지 */}
      <p className="mt-4 rounded-lg border border-border-soft bg-background/60 p-3 text-sm text-muted">
        아래 통계는 <b className="text-foreground">과거 추첨 결과의 집계</b>일
        뿐입니다. 로또는 매 회차 독립적인 무작위 추첨이므로, 많이 나온 번호가
        다음에 또 나올 확률이 더 높지 않습니다. 예측·당첨 보장이 아닌 재미로만
        참고하세요.
      </p>

      {/* 많이 나온 번호 */}
      <section className="mt-8">
        <h2 className="mb-3 text-lg font-bold">많이 나온 번호 TOP 8</h2>
        <ul className="space-y-2.5">
          {hot.map((h) => (
            <li key={h.number} className="flex items-center gap-3">
              <LottoBall n={h.number} size="sm" />
              <Bar value={h.count} max={maxCount} />
              <span className="w-16 shrink-0 text-right text-sm text-muted">
                {h.count}회
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* 적게 나온 번호 */}
      <section className="mt-8">
        <h2 className="mb-3 text-lg font-bold">적게 나온 번호 TOP 8</h2>
        <ul className="space-y-2.5">
          {cold.map((c) => (
            <li key={c.number} className="flex items-center gap-3">
              <LottoBall n={c.number} size="sm" />
              <Bar value={c.count} max={maxCount} />
              <span className="w-16 shrink-0 text-right text-sm text-muted">
                {c.count}회
              </span>
            </li>
          ))}
        </ul>
      </section>

      <AdSlot slot="2222222222" />

      {/* 오래 안 나온 번호 */}
      <section className="mt-8">
        <h2 className="mb-1 text-lg font-bold">오래 안 나온 번호</h2>
        <p className="mb-3 text-sm text-muted">
          최근 몇 회차 동안 나오지 않았는지 (0 = 최신 회차에 출현)
        </p>
        <div className="flex flex-wrap gap-2">
          {longestGaps.map((g) => (
            <div
              key={g.number}
              className="flex items-center gap-2 rounded-full border border-border-soft bg-card px-3 py-1.5 shadow-sm"
            >
              <LottoBall n={g.number} size="sm" />
              <span className="text-sm">
                <b>{g.gap}</b>
                <span className="text-muted">회째</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 전체 출현 횟수 그리드 */}
      <section className="mt-8">
        <h2 className="mb-3 text-lg font-bold">번호별 출현 횟수 (1~45)</h2>
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-9">
          {ALL_NUMBERS.map((n) => (
            <div
              key={n}
              className="flex flex-col items-center gap-1 rounded-lg border border-border-soft bg-card p-2 text-center shadow-sm"
            >
              <LottoBall n={n} size="sm" />
              <span className="text-xs text-muted">{map[n]}회</span>
            </div>
          ))}
        </div>
      </section>

      {/* 홀짝 / 고저 분포 */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border-soft bg-card p-4 shadow-sm">
          <h3 className="mb-2 font-bold">홀수 개수 분포</h3>
          <p className="mb-3 text-xs text-muted">
            한 회차 6개 중 홀수가 몇 개였는지
          </p>
          <ul className="space-y-1.5 text-sm">
            {oddDist.map((cnt, k) => (
              <li key={k} className="flex items-center justify-between gap-2">
                <span className="w-14 text-muted">홀 {k}개</span>
                <Bar value={cnt} max={Math.max(...oddDist)} />
                <span className="w-12 text-right text-muted">{cnt}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-border-soft bg-card p-4 shadow-sm">
          <h3 className="mb-2 font-bold">저·고 번호 분포</h3>
          <p className="mb-3 text-xs text-muted">
            6개 중 저번호(1~22)가 몇 개였는지
          </p>
          <ul className="space-y-1.5 text-sm">
            {lowDist.map((cnt, k) => (
              <li key={k} className="flex items-center justify-between gap-2">
                <span className="w-14 text-muted">저 {k}개</span>
                <Bar value={cnt} max={Math.max(...lowDist)} />
                <span className="w-12 text-right text-muted">{cnt}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CalcNotes
        updated="2026-08-02"
        basis={[
          {
            law: "집계 대상",
            detail:
              "1회차부터 최신 회차까지의 실제 당첨번호를 집계합니다. 당첨번호는 공개된 사실 정보이며, 데이터는 매주 추첨 후 갱신합니다.",
          },
          {
            law: "출현 빈도",
            detail:
              "각 번호가 당첨번호 6개에 포함된 횟수를 셉니다. 보너스 번호는 별도로 구분해 집계합니다.",
          },
          {
            law: "미출현 회차",
            detail:
              "해당 번호가 마지막으로 나온 회차부터 최신 회차까지의 간격입니다. '오래 안 나온 번호'를 확인하는 지표로 쓰이지만 다음 회차 확률과는 무관합니다.",
          },
          {
            law: "구간·홀짝 분포",
            detail:
              "1~10, 11~20 같은 구간별 분포와 홀짝 비율을 집계합니다. 무작위 추첨에서도 특정 패턴이 자주 보이는 것은 조합 수의 차이 때문이며 편향의 근거가 아닙니다.",
          },
        ]}
        note="통계는 지나간 결과를 정리한 것이지 앞으로를 예측하는 자료가 아닙니다. 로또는 매 회차 독립적인 무작위 추첨이므로, 과거에 많이 나왔든 오래 안 나왔든 다음 회차에 뽑힐 확률은 45분의 6으로 모두 같습니다."
        examples={[
          {
            title: "각 번호가 나올 이론적 기대 횟수",
            steps: [
              "한 회차에 45개 중 6개가 뽑힘 → 특정 번호가 포함될 확률 = 6/45 ≈ 13.3%",
              "1,200회 추첨이면 기대 횟수 = 1,200 × 6 ÷ 45 = 160회",
              "실제로는 이보다 많거나 적은 번호가 생깁니다",
            ],
            result:
              "편차가 있는 것이 정상입니다 — 편차 자체가 다음 회차를 알려주지는 않습니다",
          },
          {
            title: "'많이 나온 번호'와 '적게 나온 번호'의 차이",
            steps: [
              "1,200회 정도의 표본에서는 우연에 의한 편차가 상당히 큽니다",
              "가장 많이 나온 번호와 적게 나온 번호의 차이는 대부분 이 범위 안입니다",
              "추첨기가 특정 번호에 편향돼 있다는 근거로 보기 어렵습니다",
            ],
            result:
              "통계는 흥미로운 기록이지, 유리한 번호를 알려주는 도구가 아닙니다",
          },
        ]}
        pitfalls={[
          {
            heading: "'도박사의 오류'를 조심하세요",
            body:
              "오래 안 나온 번호가 나올 때가 됐다고 생각하는 것이 대표적인 오류입니다. 추첨기는 이전 결과를 기억하지 않으므로, 20회 연속 안 나온 번호와 지난주에 나온 번호의 확률은 완전히 같습니다.",
          },
          {
            heading: "패턴 분석도 마찬가지입니다",
            body:
              "연속번호, 홀짝 비율, 구간 분포 같은 패턴이 자주 보이는 것은 그런 조합의 가짓수가 많기 때문입니다. 특정 패턴을 따른다고 확률이 올라가지 않습니다.",
          },
          {
            heading: "통계로 유일하게 얻을 수 있는 것",
            body:
              "사람들이 잘 고르지 않는 조합(예: 32 이상 숫자가 많은 조합)을 택하면, 당첨됐을 때 나눠 가질 인원이 적어질 가능성이 있습니다. 확률이 아니라 분배 인원의 문제입니다.",
          },
          {
            heading: "재미의 범위를 벗어나지 않도록",
            body:
              "통계를 근거로 구매액을 늘리는 것은 위험합니다. 정해진 예산 안에서 즐기시고, 조절이 어렵다면 도박문제 상담전화 1336을 이용하세요.",
          },
        ]}
        sources={[
          { label: "동행복권", href: "https://dhlottery.co.kr" },
          { label: "통계로 고르면 유리할까", href: "/guide/statistics-myth" },
          { label: "한국도박문제예방치유원", href: "https://www.kcgp.or.kr" },
        ]}
      />

    </div>
  );
}
