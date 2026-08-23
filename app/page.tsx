import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import HomeNotes from "@/components/HomeNotes";
import Link from "next/link";
import { LottoBalls } from "@/components/LottoBall";
import { latestDraw, recentDraws, TOTAL_ROUNDS } from "@/lib/draws";
import { guides } from "@/lib/guides";
import { formatDate, formatWon } from "@/lib/format";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const TOOLS = [
  {
    href: "/numbers",
    title: "회차별 당첨번호 조회",
    desc: "1회부터 최신 회차까지, 당첨번호·당첨금·판매액을 한눈에",
    badge: "당첨번호",
  },
  {
    href: "/stats",
    title: "번호별 출현 통계",
    desc: "많이 나온 번호·적게 나온 번호, 홀짝·고저 비율까지",
    badge: "통계",
  },
  {
    href: "/generator",
    title: "행운 번호 생성기",
    desc: "완전 랜덤 · 통계 가중 · 제외수/고정수 설정까지",
    badge: "번호생성",
  },
  {
    href: "/check",
    title: "내 번호 당첨 확인기",
    desc: "고른 번호로 회차별·역대 등수를 한 번에 확인",
    badge: "당첨확인",
  },
];

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const latest = latestDraw;
  const recent = recentDraws(6);
  const firstDivision = latest.divisions[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "ko",
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="py-6 text-center sm:py-8">
        <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">
          로또 당첨번호와 통계,
          <br className="sm:hidden" /> 한곳에서
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted">
          1회부터 최신 {TOTAL_ROUNDS.toLocaleString()}회까지 전 회차 당첨번호와
          번호별 출현 통계, 그리고 행운 번호 생성기까지. 회원가입도, 개인정보
          입력도 없습니다.
        </p>
      </section>

      {/* 최신 회차 당첨번호 */}
      <section className="rounded-2xl border border-border-soft bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-lg font-bold">
            제 {latest.round}회 당첨번호
          </h2>
          <span className="text-sm text-muted">{formatDate(latest.date)} 추첨</span>
        </div>
        <LottoBalls numbers={latest.numbers} bonus={latest.bonus} size="lg" />
        {firstDivision && (
          <p className="mt-4 text-sm text-muted">
            1등 {firstDivision.winners.toLocaleString()}게임 · 게임당{" "}
            <b className="text-foreground">{formatWon(firstDivision.prize)}</b>
          </p>
        )}
        <Link
          href="/numbers"
          className="mt-4 inline-block text-sm font-semibold text-accent hover:underline"
        >
          지난 회차 전체 보기 →
        </Link>
      </section>

      {/* 도구 카드 */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        {TOOLS.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="rounded-2xl border border-border-soft bg-card p-5 shadow-sm transition-all hover:border-accent hover:shadow-md"
          >
            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent-strong">
              {tool.badge}
            </span>
            <h3 className="mt-3 text-base font-bold leading-snug">
              {tool.title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              {tool.desc}
            </p>
          </Link>
        ))}
      </section>

      {/* 최근 회차 요약 */}
      <section className="mt-10">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-xl font-bold">최근 당첨번호</h2>
          <Link href="/numbers" className="text-sm text-accent hover:underline">
            전체 보기 →
          </Link>
        </div>
        <ul className="space-y-2">
          {recent.map((d) => (
            <li key={d.round}>
              <Link
                href={`/numbers/${d.round}`}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-border-soft bg-card p-3 shadow-sm transition-all hover:border-accent hover:shadow-md"
              >
                <span className="w-16 shrink-0 text-sm font-bold text-accent-strong">
                  {d.round}회
                </span>
                <LottoBalls numbers={d.numbers} bonus={d.bonus} size="sm" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* 가이드 teaser */}
      <section className="mt-10">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-xl font-bold">로또, 이런 게 궁금하다면</h2>
          <Link href="/guide" className="text-sm text-accent hover:underline">
            전체 보기 →
          </Link>
        </div>
        <ul className="space-y-2">
          {guides.slice(0, 10).map((g) => (
            <li key={g.slug}>
              <div className="rounded-xl border border-border-soft bg-card p-4 shadow-sm transition-all hover:border-accent">
                {/* 제목만 링크로 둔다 — 설명까지 앵커에 넣으면 본문 대부분이
                    링크 텍스트가 된다. */}
                <p className="font-bold leading-snug">
                  <Link href={`/guide/${g.slug}`} className="hover:text-accent">
                    {g.title}
                  </Link>
                </p>
                <p className="mt-1 line-clamp-2 text-sm text-muted">
                  {g.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* 검색 유입용 본문 */}
      <section className="mt-12 space-y-4 text-[15px] leading-relaxed">
        <h2 className="text-xl font-bold">로또 6/45, 숫자로 살펴보기</h2>
        <p>
          로또 6/45는 1부터 45까지의 숫자 중 6개를 맞히는 게임입니다.
          {SITE_NAME}는 매주 토요일 추첨된 역대 당첨번호를 모아, 어떤 번호가
          얼마나 자주 나왔는지, 최근 어떤 회차에 어떤 번호가 나왔는지를 쉽게
          확인할 수 있게 정리했습니다.
        </p>
        <p>
          다만 분명히 해둘 것이 있습니다. 로또는 매 회차가 완전히 독립적인
          무작위 추첨이라, 과거에 많이 나온 번호가 다음에 또 나올 확률이 더
          높지도, 낮지도 않습니다. 이 사이트의 통계와 번호 생성기는{" "}
          <b>당첨을 예측하거나 보장하지 않으며</b>, 숫자를 재미있게 살펴보고
          번호를 고르는 참고용 도구일 뿐입니다. 즐거운 만큼만, 정해둔 예산
          안에서 이용하세요.
        </p>
      </section>
      <HomeNotes
        siteName={SITE_NAME}
        updated="2026-08-02"
        intro="이 사이트는 당첨을 예측하거나 확률을 높여준다고 말하지 않습니다. 지나간 결과를 조회하고 정리하는 도구입니다."
        scenarios={[
          {
            situation: "지난 회차 당첨번호를 확인하고 싶을 때",
            action:
              "1회차부터 최신 회차까지 당첨번호와 등수별 당첨금, 당첨자 수를 볼 수 있습니다. 당첨금이 매주 달라지는 이유는 그 회차 재원을 당첨자 수로 나누기 때문입니다.",
            href: "/numbers",
            label: "회차별 당첨번호 보기",
          },
          {
            situation: "번호별로 얼마나 나왔는지 궁금할 때",
            action:
              "출현 빈도와 미출현 회차를 집계해 보여줍니다. 다만 이 통계는 지나간 기록이지 다음 회차를 알려주는 자료가 아닙니다.",
            href: "/stats",
            label: "번호별 통계 보기",
          },
          {
            situation: "번호 고르기가 귀찮을 때",
            action:
              "완전 랜덤 또는 통계 가중 방식으로 번호를 뽑아 드립니다. 고정수와 제외수도 설정할 수 있습니다. 어떤 방식이든 당첨 확률은 동일합니다.",
            href: "/generator",
            label: "번호 생성하기",
          },
          {
            situation: "구매한 번호가 몇 등인지 확인할 때",
            action:
              "번호를 넣으면 등수를 판정하고 역대 회차 기준 결과도 함께 보여줍니다. 당첨금 지급 기한은 1년이므로 그때그때 확인하는 것이 좋습니다.",
            href: "/check",
            label: "당첨 확인하기",
          },
        ]}
        faq={[
          {
            q: "통계로 번호를 고르면 당첨 확률이 올라가나요?",
            a: "올라가지 않습니다. 로또는 매 회차 독립적인 무작위 추첨이라 이전 결과가 다음 회차에 영향을 주지 않습니다. 1등 확률은 어떤 조합을 고르든 8,145,060분의 1로 같습니다.",
          },
          {
            q: "오래 안 나온 번호가 나올 때가 되지 않았나요?",
            a: "도박사의 오류라고 부르는 대표적인 착각입니다. 추첨기는 이전 결과를 기억하지 않으므로, 20회 연속 안 나온 번호와 지난주에 나온 번호의 확률은 완전히 같습니다.",
          },
          {
            q: "당첨번호 데이터는 어디서 가져오나요?",
            a: "공개된 당첨번호 데이터를 정규화해 저장하고 매주 추첨 후 갱신합니다. 다만 공식 자료가 아니므로 최종 확인은 동행복권에서 하시기 바랍니다.",
          },
          {
            q: "번호를 예측해 주는 서비스가 있던데요?",
            a: "무작위 추첨의 결과를 미리 아는 방법은 존재하지 않습니다. 예측을 표방하거나 유료로 번호를 파는 곳은 근거가 없으니 주의하세요.",
          },
        ]}
        maintained={[
          "회차별 당첨번호와 등수별 당첨금 데이터 (매주 추첨 후 갱신)",
          "등수 판정 기준과 당첨금 배분 구조",
          "복권 당첨금 원천징수 세율 (소득세법)",
          "당첨금 지급 기한과 수령 절차",
        ]}
      />

      <AdSlot slot="home-bottom" />
    </div>
  );
}
