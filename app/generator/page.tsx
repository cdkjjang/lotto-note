import type { Metadata } from "next";
import GeneratorClient from "@/components/GeneratorClient";
import AdSlot from "@/components/AdSlot";
import CalcNotes from "@/components/CalcNotes";
import { draws } from "@/lib/draws";
import { frequencyWeights } from "@/lib/stats";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/generator" },
  title: "로또 번호 생성기 — 랜덤·통계 가중·제외수 설정",
  description:
    "완전 랜덤 또는 통계 가중 방식으로 로또 6/45 번호를 생성합니다. 고정수·제외수 설정과 여러 게임 동시 생성까지. 재미로 보는 번호 추천입니다.",
};

export default function GeneratorPage() {
  // 검색결과에 "사이트명 > 도구명" 경로가 표시되도록 한다.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "번호 생성기" },
    ],
  };

  // 통계 가중 모드용 가중치는 서버에서 계산해 전달(전체 데이터를 클라이언트로
  // 내려보내지 않도록). index 1..45.
  const weights = frequencyWeights(draws);

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
      <CalcNotes
        updated="2026-08-02"
        basis={[
          {
            law: "로또 6/45의 구조",
            detail:
              "1부터 45까지 45개 숫자 중 6개를 고릅니다. 가능한 조합의 수는 45C6 = 8,145,060가지이며, 각 조합이 뽑힐 확률은 모두 동일합니다.",
          },
          {
            law: "완전 랜덤 방식",
            detail:
              "45개 숫자에 동일한 가중치를 두고 6개를 비복원 추출합니다. 실제 추첨과 같은 조건이며, 어떤 번호도 다른 번호보다 유리하지 않습니다.",
          },
          {
            law: "통계 가중 방식",
            detail:
              "과거 회차에서 자주 나온 번호에 더 큰 가중치를 두고 뽑습니다. 다만 이것은 '자주 나온 번호를 더 자주 뽑는' 것일 뿐, 다음 회차의 당첨 확률을 높이지 않습니다.",
          },
          {
            law: "고정수·제외수",
            detail:
              "특정 번호를 반드시 포함하거나 제외한 상태에서 나머지를 무작위로 채웁니다. 선택의 폭을 줄일 뿐 확률에는 영향을 주지 않습니다.",
          },
        ]}
        note="이 생성기는 번호를 고르는 수고를 덜어주는 도구이며 당첨을 예측하거나 보장하지 않습니다. 로또는 매 회차 독립적인 무작위 추첨이므로, 어떤 방식으로 번호를 뽑아도 1등 확률은 8,145,060분의 1로 같습니다."
        examples={[
          {
            title: "1등 확률 8,145,060분의 1은 어느 정도인가",
            steps: [
              "45개 중 6개를 순서 없이 고르는 경우의 수 = 45C6",
              "45 × 44 × 43 × 42 × 41 × 40 ÷ (6 × 5 × 4 × 3 × 2 × 1)",
              "= 8,145,060가지",
              "한 게임을 사면 그중 하나를 고른 것",
            ],
            result: "매주 5게임씩 사도 평균적으로 3만 년 이상 걸리는 확률입니다",
          },
          {
            title: "'통계 가중'이 확률을 높이지 않는 이유",
            steps: [
              "추첨은 매 회차 독립 사건입니다",
              "이전 회차 결과가 다음 회차에 영향을 주지 않습니다",
              "많이 나온 번호가 앞으로도 많이 나올 이유가 없습니다",
              "다만 사람들이 덜 고르는 조합을 택하면, 당첨 시 나눠 가질 인원이 줄어들 가능성은 있습니다",
            ],
            result:
              "확률은 그대로이고 분배 인원만 달라질 수 있다는 점이 정확한 설명입니다",
          },
        ]}
        pitfalls={[
          {
            heading: "예측한다고 광고하는 서비스를 조심하세요",
            body:
              "당첨 번호를 예측할 수 있다고 하거나 유료로 번호를 파는 곳은 근거가 없습니다. 무작위 추첨의 결과를 미리 아는 방법은 존재하지 않습니다.",
          },
          {
            heading: "'한 번도 안 나온 조합'이라는 말은 의미가 없습니다",
            body:
              "조합이 814만 가지인데 지금까지 추첨은 1,200여 회에 불과합니다. 대부분의 조합은 당연히 한 번도 나온 적이 없습니다.",
          },
          {
            heading: "예산을 먼저 정하세요",
            body:
              "복권은 기대수익을 계산하는 대상이 아니라 정해진 금액 안에서 즐기는 오락입니다. 감당할 수 있는 금액을 미리 정하고 그 범위를 넘지 않는 것이 유일하게 확실한 관리 방법입니다.",
          },
          {
            heading: "조절이 어렵다면 상담받으세요",
            body:
              "구매를 멈추기 어렵거나 생활에 지장이 생긴다면 한국도박문제예방치유원 상담전화 1336에서 무료로 상담받을 수 있습니다. 만 19세 미만은 구매할 수 없습니다.",
          },
        ]}
        sources={[
          { label: "동행복권", href: "https://dhlottery.co.kr" },
          { label: "한국도박문제예방치유원", href: "https://www.kcgp.or.kr" },
          { label: "당첨 확률 자세히 보기", href: "/guide/odds" },
        ]}
      />

    </div>
  );
}
