import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LottoBalls } from "@/components/LottoBall";
import AdSlot from "@/components/AdSlot";
import {
  DIVISION_LABELS,
  draws,
  getDraw,
  latestDraw,
} from "@/lib/draws";
import { formatDate, formatNumber, formatWon } from "@/lib/format";
import { SITE_NAME, SITE_URL } from "@/lib/site";

interface Props {
  params: Promise<{ round: string }>;
}

// 고정된 데이터셋이므로 목록에 없는 회차는 404
export const dynamicParams = false;

export function generateStaticParams() {
  return draws.map((d) => ({ round: String(d.round) }));
}

function parseRound(s: string): number | null {
  if (!/^\d+$/.test(s)) return null;
  return parseInt(s, 10);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { round } = await params;
  const n = parseRound(round);
  const draw = n ? getDraw(n) : undefined;
  if (!draw) return {};
  const nums = draw.numbers.join(", ");
  const title = `제${draw.round}회 로또 당첨번호 (${formatDate(draw.date)})`;
  const description = `${draw.round}회 로또 6/45 당첨번호는 ${nums} + 보너스 ${draw.bonus}. 1등 당첨금과 등수별 당첨 결과, 총 판매액을 확인하세요.`;
  return {
    title,
    description,
    alternates: { canonical: `/numbers/${draw.round}` },
    openGraph: { title, description },
  };
}

export default async function DrawDetailPage({ params }: Props) {
  const { round } = await params;
  const n = parseRound(round);
  const draw = n ? getDraw(n) : undefined;
  if (!draw) notFound();

  const prev = draw.round > 1 ? draw.round - 1 : null;
  const next = draw.round < latestDraw.round ? draw.round + 1 : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `제${draw.round}회 로또 당첨번호`,
    datePublished: draw.date,
    inLanguage: "ko",
    mainEntityOfPage: `${SITE_URL}/numbers/${draw.round}`,
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <p className="text-sm text-muted">
        <Link href="/numbers" className="hover:text-accent">
          당첨번호
        </Link>{" "}
        › 제{draw.round}회
      </p>

      <h1 className="mt-2 text-2xl font-extrabold">
        제 {draw.round}회 로또 당첨번호
      </h1>
      <p className="mt-1 text-muted">{formatDate(draw.date)} 추첨</p>

      {/* 당첨번호 */}
      <section className="mt-6 rounded-2xl border border-border-soft bg-card p-6 shadow-sm">
        <LottoBalls numbers={draw.numbers} bonus={draw.bonus} size="lg" />

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
              {draw.divisions.map((d, i) => (
                <tr key={i} className="border-b border-border-soft/60">
                  <td className="py-2 pr-3 font-medium">{DIVISION_LABELS[i]}</td>
                  <td className="py-2 pr-3">{formatNumber(d.winners)}게임</td>
                  <td className="py-2 font-semibold">{formatWon(d.prize)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted">
          총 판매액 {formatWon(draw.totalSales)} · 1등 자동{" "}
          {draw.combination.auto} / 반자동 {draw.combination.semiAuto} / 수동{" "}
          {draw.combination.manual}
        </p>
      </section>

      {/* 이전/다음 회차 */}
      <nav className="mt-6 flex items-center justify-between gap-3">
        {prev ? (
          <Link
            href={`/numbers/${prev}`}
            className="rounded-xl border border-border-soft bg-card px-4 py-2.5 text-sm font-semibold shadow-sm hover:border-accent"
          >
            ← {prev}회
          </Link>
        ) : (
          <span />
        )}
        <Link href="/numbers" className="text-sm text-accent hover:underline">
          전체 목록
        </Link>
        {next ? (
          <Link
            href={`/numbers/${next}`}
            className="rounded-xl border border-border-soft bg-card px-4 py-2.5 text-sm font-semibold shadow-sm hover:border-accent"
          >
            {next}회 →
          </Link>
        ) : (
          <span />
        )}
      </nav>

      <AdSlot slot="6666666666" />

      {/* 도구 연결 */}
      <section className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link
          href="/stats"
          className="rounded-2xl border border-border-soft bg-card p-4 shadow-sm hover:border-accent"
        >
          <p className="font-bold">번호별 통계 보기</p>
          <p className="mt-1 text-sm text-muted">
            어떤 번호가 많이·적게 나왔는지 한눈에
          </p>
        </Link>
        <Link
          href="/generator"
          className="rounded-2xl border border-border-soft bg-card p-4 shadow-sm hover:border-accent"
        >
          <p className="font-bold">행운 번호 생성기</p>
          <p className="mt-1 text-sm text-muted">
            이 번호를 고정수로 넣고 새로 뽑기
          </p>
        </Link>
      </section>

      <p className="mt-8 text-xs text-muted">
        공식 당첨 결과는 동행복권(dhlottery.co.kr)에서 확인하세요. {SITE_NAME}는
        정보 제공·오락용이며 정확성을 보증하지 않습니다.
      </p>
    </div>
  );
}
