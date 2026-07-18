import type { Metadata } from "next";
import CheckClient from "@/components/CheckClient";
import AdSlot from "@/components/AdSlot";
import { draws, latestDraw } from "@/lib/draws";
import type { SlimDraw } from "@/lib/check";

export const metadata: Metadata = {
  title: "로또 당첨 확인기 — 내 번호 당첨 여부·등수 조회",
  description:
    "내가 고른 로또 번호 6개를 원하는 회차와 대조해 등수를 확인하고, 역대 전 회차에서 몇 등이었을지도 재미로 확인해 보세요.",
};

export default function CheckPage() {
  // 클라이언트로는 슬림 데이터(회차·번호·보너스)만 전달
  const slim: SlimDraw[] = draws.map((d) => ({
    round: d.round,
    date: d.date,
    numbers: d.numbers,
    bonus: d.bonus,
  }));

  return (
    <div>
      <h1 className="text-2xl font-extrabold">로또 당첨 확인기</h1>
      <p className="mt-2 text-muted">
        내 번호 6개를 골라 원하는 회차와 대조해 보세요. 역대 전 회차에서 몇
        등이었을지도 함께 알려드립니다.
      </p>

      <p className="mt-4 rounded-lg border border-border-soft bg-background/60 p-3 text-sm text-muted">
        이 도구는 과거 당첨 결과와 대조하는 <b className="text-foreground">참고용</b>{" "}
        기능입니다. 실제 당첨 여부·당첨금은 반드시 동행복권(dhlottery.co.kr) 또는
        판매점에서 확인하세요.
      </p>

      <div className="mt-6">
        <CheckClient draws={slim} latestRound={latestDraw.round} />
      </div>

      <AdSlot slot="7777777777" />
    </div>
  );
}
