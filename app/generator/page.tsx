import type { Metadata } from "next";
import GeneratorClient from "@/components/GeneratorClient";
import AdSlot from "@/components/AdSlot";
import { draws } from "@/lib/draws";
import { frequencyWeights } from "@/lib/stats";

export const metadata: Metadata = {
  title: "로또 번호 생성기 — 랜덤·통계 가중·제외수 설정",
  description:
    "완전 랜덤 또는 통계 가중 방식으로 로또 6/45 번호를 생성합니다. 고정수·제외수 설정과 여러 게임 동시 생성까지. 재미로 보는 번호 추천입니다.",
};

export default function GeneratorPage() {
  // 통계 가중 모드용 가중치는 서버에서 계산해 전달(전체 데이터를 클라이언트로
  // 내려보내지 않도록). index 1..45.
  const weights = frequencyWeights(draws);

  return (
    <div>
      <h1 className="text-2xl font-extrabold">행운 번호 생성기</h1>
      <p className="mt-2 text-muted">
        완전 랜덤 또는 통계 가중 방식으로 번호를 뽑아 드립니다. 원하는 번호는
        고정하고, 빼고 싶은 번호는 제외할 수 있어요.
      </p>

      <p className="mt-4 rounded-lg border border-border-soft bg-background/60 p-3 text-sm text-muted">
        생성 방식과 무관하게 <b className="text-foreground">당첨 확률은 모두
        동일</b>합니다. 로또는 매 회차 독립적인 무작위 추첨이며, 이 생성기는
        번호를 재미있게 고르기 위한 도구일 뿐 당첨을 예측·보장하지 않습니다.
      </p>

      <div className="mt-6">
        <GeneratorClient weights={weights} />
      </div>

      <AdSlot slot="3333333333" />
    </div>
  );
}
