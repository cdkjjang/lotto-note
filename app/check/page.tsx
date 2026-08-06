import type { Metadata } from "next";
import CheckClient from "@/components/CheckClient";
import AdSlot from "@/components/AdSlot";
import CalcNotes from "@/components/CalcNotes";
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
      <CalcNotes
        updated="2026-08-02"
        basis={[
          {
            law: "등수 판정 기준",
            detail:
              "1등은 6개 일치, 2등은 5개 일치 + 보너스 번호 일치, 3등은 5개 일치, 4등은 4개 일치, 5등은 3개 일치입니다. 보너스 번호는 2등 판정에만 쓰입니다.",
          },
          {
            law: "당첨금 결정 방식",
            detail:
              "5등만 1게임당 5,000원으로 고정이고, 1~4등은 그 회차 당첨금 재원을 등급별 비율로 나눈 뒤 당첨자 수로 다시 나눕니다. 그래서 같은 등수라도 회차마다 금액이 다릅니다.",
          },
          {
            law: "소득세법 제21조 (기타소득)",
            detail:
              "복권 당첨금은 기타소득으로 분류되어 지급 시점에 원천징수됩니다. 당첨금 규모에 따라 적용 세율이 달라지며, 원천징수로 과세가 종결됩니다.",
          },
          {
            law: "지급 기한",
            detail:
              "당첨금은 지급 개시일로부터 1년 안에 수령해야 합니다. 이 기간을 넘기면 받을 수 없으므로 당첨 확인은 그때그때 하는 것이 좋습니다.",
          },
        ]}
        note="이 확인기는 입력한 번호와 당첨번호를 대조해 등수를 알려주는 도구입니다. 공식 당첨 확인과 당첨금 수령은 동행복권과 지정 금융기관에서 이루어지며, 실제 지급 여부는 실물 복권으로 확인됩니다."
        examples={[
          {
            title: "당첨번호 5개 일치 — 2등과 3등 가르기",
            steps: [
              "내 번호 6개 중 당첨번호와 일치하는 것이 5개",
              "남은 1개가 보너스 번호와 같은지 확인",
              "같으면 2등, 다르면 3등",
            ],
            result:
              "숫자 하나 차이지만 당첨금 규모는 크게 벌어집니다",
          },
          {
            title: "5등(3개 일치)의 실수령",
            steps: [
              "5등 당첨금은 1게임당 5,000원 고정",
              "소액이라 원천징수 대상이 아닙니다",
              "판매점에서 바로 교환할 수 있습니다",
            ],
            result:
              "1게임 1,000원을 주고 5,000원을 받으므로 네 배 회수",
          },
        ]}
        pitfalls={[
          {
            heading: "실물 복권을 잃어버리면 받을 수 없습니다",
            body:
              "당첨금 지급은 실물 복권을 근거로 합니다. 사진만으로는 수령이 어려우므로 추첨일까지 실물을 잘 보관하세요. 인터넷 구매분은 계정에 기록이 남습니다.",
          },
          {
            heading: "지급 기한 1년을 넘기면 소멸합니다",
            body:
              "매년 상당한 금액이 미수령으로 소멸됩니다. 당첨 여부를 확인하지 않고 지나가는 경우가 대부분이므로, 구매한 회차는 그 주에 확인하는 습관을 들이세요.",
          },
          {
            heading: "등수에 따라 수령 장소가 다릅니다",
            body:
              "소액은 판매점에서, 금액이 커지면 농협은행 지점이나 본점에서 수령합니다. 필요한 서류와 절차가 다르므로 당첨 시 안내를 확인하세요.",
          },
          {
            heading: "재미의 범위를 지키세요",
            body:
              "당첨 확인이 반복 구매로 이어지지 않도록 예산을 정해두는 것이 좋습니다. 조절이 어렵다면 한국도박문제예방치유원 1336에서 상담받을 수 있습니다.",
          },
        ]}
        sources={[
          { label: "동행복권", href: "https://dhlottery.co.kr" },
          { label: "당첨금 수령 방법과 기한", href: "/guide/claim" },
          { label: "당첨금 세금 정리", href: "/guide/tax" },
        ]}
      />

    </div>
  );
}
