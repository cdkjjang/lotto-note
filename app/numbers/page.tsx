import type { Metadata } from "next";
import Link from "next/link";
import { LottoBalls } from "@/components/LottoBall";
import AdSlot from "@/components/AdSlot";
import RoundJump from "@/components/RoundJump";
import {
  DIVISION_LABELS,
  draws,
  latestDraw,
  recentDraws,
  TOTAL_ROUNDS,
} from "@/lib/draws";
import { formatDate, formatNumber, formatWon } from "@/lib/format";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "로또 당첨번호 조회 — 회차별 당첨번호·당첨금",
  description:
    "로또 6/45 1회부터 최신 회차까지 당첨번호와 1~5등 당첨금, 당첨 게임 수, 총 판매액을 회차별로 확인하세요.",
};

const RECENT_COUNT = 100;

export default function NumbersPage() {
  const latest = latestDraw;
  const recent = recentDraws(RECENT_COUNT);

  return (
    <div>
      <h1 className="text-2xl font-extrabold">로또 당첨번호 조회</h1>
      <p className="mt-2 text-muted">
        제1회(2002.12.07)부터 제{latest.round}회까지 총{" "}
        {TOTAL_ROUNDS.toLocaleString()}회차의 당첨번호입니다.
      </p>

      {/* 회차 바로가기 */}
      <div className="mt-5">
        <p className="mb-2 text-sm font-semibold">회차 바로가기</p>
        <RoundJump max={latest.round} />
      </div>

      {/* 최신 회차 상세 */}
      <section className="mt-6 rounded-2xl border border-border-soft bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-lg font-bold">제 {latest.round}회 (최신)</h2>
          <span className="text-sm text-muted">
            {formatDate(latest.date)} 추첨
          </span>
        </div>
        <LottoBalls numbers={latest.numbers} bonus={latest.bonus} size="lg" />

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[420px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border-soft text-left text-muted">
                <th className="py-2 pr-3 font-semibold">등위</th>
                <th className="py-2 pr-3 font-semibold">당첨 게임 수</th>
                <th className="py-2 font-semibold">게임당 당첨금</th>
              </tr>
            </thead>
            <tbody>
              {latest.divisions.map((d, i) => (
                <tr key={i} className="border-b border-border-soft/60">
                  <td className="py-2 pr-3 font-medium">
                    {DIVISION_LABELS[i]}
                  </td>
                  <td className="py-2 pr-3">
                    {formatNumber(d.winners)}게임
                  </td>
                  <td className="py-2 font-semibold">{formatWon(d.prize)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted">
          총 판매액 {formatWon(latest.totalSales)} · 1등 자동{" "}
          {latest.combination.auto} / 반자동 {latest.combination.semiAuto} /
          수동 {latest.combination.manual}
        </p>
        <Link
          href={`/numbers/${latest.round}`}
          className="mt-4 inline-block text-sm font-semibold text-accent hover:underline"
        >
          이 회차 상세 페이지 →
        </Link>
      </section>

      <AdSlot slot="1111111111" />

      {/* 지난 회차 목록 */}
      <section className="mt-8">
        <h2 className="mb-4 text-lg font-bold">
          지난 회차 (최근 {RECENT_COUNT}회)
        </h2>
        <ul className="space-y-2">
          {recent.map((d) => (
            <li key={d.round}>
              <Link
                href={`/numbers/${d.round}`}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-border-soft bg-card p-3 shadow-sm transition-all hover:border-accent hover:shadow-md"
              >
                <span className="w-24 shrink-0 text-sm">
                  <b className="text-accent-strong">{d.round}회</b>
                  <span className="ml-1 text-xs text-muted">
                    {formatDate(d.date).slice(5)}
                  </span>
                </span>
                <LottoBalls numbers={d.numbers} bonus={d.bonus} size="sm" />
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-center text-sm text-muted">
          더 이전 회차와 회차별 상세 페이지는 순차적으로 추가됩니다.
        </p>
      </section>

      {/* 데이터 출처 고지 */}
      <p className="mt-8 text-xs text-muted">
        당첨 데이터는 공개된 과거 추첨 결과를 정리한 것입니다. 공식 결과는
        동행복권(dhlottery.co.kr)에서 확인하세요. {SITE_NAME}는 정보 제공을
        목적으로 하며 정확성을 보증하지 않습니다.
      </p>
    </div>
  );
}
