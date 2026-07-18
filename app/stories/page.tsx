import type { Metadata } from "next";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import { dreams, type DreamLuck } from "@/lib/dreams";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "로또 꿈 해몽 · 이야기 — 돼지꿈부터 조상꿈까지",
  description:
    "로또와 얽혀 예로부터 전해 내려오는 꿈 속설 모음. 돼지꿈·조상꿈·똥꿈 등 길몽 이야기와 당첨자 이야기에 대한 솔직한 정리. 재미로 보는 콘텐츠입니다.",
};

const LUCK_STYLE: Record<DreamLuck, string> = {
  길몽: "bg-accent/10 text-accent-strong",
  흉몽: "bg-[#d14343]/10 text-[#d14343]",
  중립: "bg-border-soft text-muted",
};

export default function StoriesPage() {
  return (
    <div>
      <h1 className="text-2xl font-extrabold">로또 꿈 해몽 · 이야기</h1>
      <p className="mt-2 text-muted">
        로또와 얽혀 예로부터 전해 내려오는 꿈 이야기를 모았습니다.
      </p>

      <p className="mt-4 rounded-lg border border-border-soft bg-background/60 p-3 text-sm text-muted">
        아래 내용은 민간 <b className="text-foreground">속설·전통 해몽</b>을
        정리한 <b className="text-foreground">재미용</b> 콘텐츠입니다. 어떤 꿈도
        로또 당첨 확률에 영향을 주지 않습니다. 가볍게 즐겨 주세요.
      </p>

      {/* 꿈 해몽 카드 */}
      <section className="mt-8">
        <h2 className="mb-4 text-lg font-bold">재물과 얽힌 꿈 이야기</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {dreams.map((d) => (
            <div
              key={d.title}
              className="rounded-2xl border border-border-soft bg-card p-4 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl" aria-hidden>
                  {d.emoji}
                </span>
                <h3 className="font-bold">{d.title}</h3>
                <span
                  className={`ml-auto rounded-full px-2.5 py-0.5 text-xs font-semibold ${LUCK_STYLE[d.luck]}`}
                >
                  {d.luck}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {d.meaning}
              </p>
            </div>
          ))}
        </div>
      </section>

      <AdSlot slot="5555555555" />

      {/* 당첨자 이야기, 솔직하게 */}
      <section className="mt-10 space-y-4 text-[15px] leading-relaxed">
        <h2 className="text-lg font-bold">당첨자 이야기, 진짜일까?</h2>
        <p>
          &lsquo;꿈에서 숫자를 봤다&rsquo;, &lsquo;돼지가 나왔다&rsquo; 같은 당첨
          후기는 언제나 화제가 됩니다. 하지만 이런 이야기는 대부분 당첨된
          다음에 그 전날의 일을 특별하게 기억하며 만들어집니다. 같은 꿈을 꾸고도
          당첨되지 않은 훨씬 많은 사람들은 이야기로 남지 않을 뿐입니다.
        </p>
        <p>
          실제 당첨자들의 공통점을 굳이 꼽자면, 특별한 비법이 아니라{" "}
          <b>평범하게 샀다</b>는 것입니다. 늘 가던 길에 무심코 한 장, 자동으로
          빠르게 한 장. 그러니 어떤 꿈을 꾸었든 마음 편히, 정해둔 예산 안에서
          재미로 즐기는 것이 가장 좋습니다.
        </p>
      </section>

      {/* 도구 연결 */}
      <div className="mt-8 rounded-2xl border-2 border-accent bg-card p-5 text-center">
        <p className="font-bold">좋은 꿈 꾸셨나요?</p>
        <p className="mt-1 text-sm text-muted">
          꿈에서 본 숫자를 고정수로 넣고 번호를 뽑아보세요.
        </p>
        <Link
          href="/generator"
          className="mt-3 inline-block rounded-xl bg-accent px-6 py-2.5 font-bold text-white transition-colors hover:bg-accent-strong"
        >
          번호 생성기로 이동 →
        </Link>
      </div>

      <p className="mt-8 text-xs text-muted">
        {SITE_NAME}는 정보 제공·오락용 서비스이며, 로또는 완전 무작위 추첨으로
        당첨을 예측·보장하지 않습니다. 복권은 만 19세 이상만 구매할 수 있고,
        도박 문제 상담은 국번없이 1336에서 받을 수 있습니다.
      </p>
    </div>
  );
}
