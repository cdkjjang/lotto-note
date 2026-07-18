import type { Metadata } from "next";
import { LottoBall } from "@/components/LottoBall";
import AdSlot from "@/components/AdSlot";
import { draws, latestDraw, TOTAL_ROUNDS } from "@/lib/draws";
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
    </div>
  );
}
