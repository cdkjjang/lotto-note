import type { Metadata } from "next";
import Link from "next/link";
import { guides } from "@/lib/guides";

export const metadata: Metadata = {
  title: "로또 가이드 — 확률·세금·수령·번호 선택의 진실",
  description:
    "로또 6/45 1등 당첨 확률, 당첨금 세금과 실수령액, 수령 방법과 기한, 통계·자동수동·명당에 대한 미신과 사실까지. 알아두면 좋은 로또 정보를 글로 정리했습니다.",
  alternates: { canonical: "/guide" },
};

export default function GuideListPage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-extrabold">로또 가이드</h1>
      <p className="mb-8 text-muted">
        당첨 확률과 세금 같은 기본 정보부터, 번호 선택에 얽힌 미신과 사실까지.
        필요한 글만 골라 읽어도 좋습니다.
      </p>
      <ul className="space-y-4">
        {guides.map((g) => (
          <li key={g.slug}>
            <Link
              href={`/guide/${g.slug}`}
              className="block rounded-2xl border border-border-soft bg-card p-5 shadow-sm transition-all hover:border-accent hover:shadow-md"
            >
              <h2 className="font-bold leading-snug">{g.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {g.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-xs text-muted">
        본 가이드는 일반적인 정보 제공·오락용이며, 세무·법률 자문이 아닙니다.
        로또는 매 회차 완전 무작위 추첨으로 어떤 정보도 당첨을 예측·보장하지
        않습니다. 공식 정보는 동행복권(dhlottery.co.kr)에서 확인하세요.
      </p>
    </div>
  );
}
