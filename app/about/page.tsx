import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  title: "소개",
  description: `${SITE_NAME} 서비스 소개 — 데이터 출처, 통계를 보여 주되 예측하지 않는 이유, 그리고 하지 않는 것.`,
};

export default function AboutPage() {
  return (
    <div className="space-y-6 text-[15px] leading-relaxed">
      <h1 className="text-2xl font-extrabold">{SITE_NAME} 소개</h1>

      <p>
        {SITE_NAME}는 로또 6/45의 역대 당첨번호와 번호별 통계를 쉽게 확인하고, 재미로
        번호를 뽑아볼 수 있는 무료 도구입니다. 회원가입이나 개인정보 입력 없이 누구나
        바로 사용할 수 있습니다. 생활 속 애매한 문제를 해결하는{" "}
        <a href="https://lifebanjang.com" className="text-accent hover:underline">
          생활반장
        </a>{" "}
        노트 시리즈의 하나입니다.
      </p>

      <section>
        <h2 className="mb-2 text-lg font-bold">제공하는 것</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>1회부터 최신 회차까지 당첨번호·당첨금 조회</li>
          <li>번호별 출현 횟수, 미출현 기간, 홀짝·고저 분포 통계</li>
          <li>완전 랜덤·통계 가중, 고정수·제외수 기반 번호 생성기</li>
          <li>내가 산 번호가 역대 회차에서 몇 등이었을지 확인</li>
          <li>당첨 확률·세금·수령 절차 가이드</li>
        </ul>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-bold">통계를 보여 주되 예측하지 않습니다</h2>
        <p>
          이 사이트의 성격을 가르는 지점입니다. 번호별 출현 횟수나 미출현 기간을
          보여 주지만, 그것으로 <strong>다음 회차를 맞힐 수 있다고 말하지
          않습니다.</strong>
        </p>
        <p className="mt-2">
          로또는 매 회차가 완전히 독립적인 무작위 추첨입니다. 지난 회차에 무엇이
          나왔는지가 다음 회차에 영향을 주지 않습니다. 어떤 번호가 오래 안 나왔다고
          해서 나올 때가 된 것도 아닙니다. <strong>8,145,060가지 조합은 모두 정확히
          같은 확률</strong>입니다.
        </p>
        <p className="mt-2">
          그래서 통계는 <strong>지나간 기록을 보는 재미</strong>의 영역으로만 다룹니다.
          번호 생성기도 마찬가지입니다. 손으로 고르는 수고를 덜어 줄 뿐, 확률을
          바꾸지 않습니다.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-bold">데이터 출처</h2>
        <p>
          당첨 데이터는 공개된 과거 추첨 결과를 정리한 것이며, 매주 추첨 후
          갱신합니다. <strong>공식 자료가 아닙니다.</strong> 공식 당첨 결과와 최신
          정보는 <strong>동행복권(dhlottery.co.kr)</strong>에서 확인하시고,
          당첨 여부는 반드시 실물 복권과 공식 발표로 확인하세요. {SITE_NAME}는
          정보의 정확성을 보증하지 않습니다.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-bold">하지 않는 것</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>복권 판매·구매 대행</strong> — 이 사이트에서 복권을 살 수 없고,
            구매를 유도하지 않습니다
          </li>
          <li>
            <strong>외부 도박 사이트 연결</strong> — 제휴 링크를 넣지 않습니다
          </li>
          <li>
            <strong>유료 번호 제공·적중 보장</strong> — 결제 기능이 없고, 그런
            주장을 하지 않습니다
          </li>
          <li>
            <strong>당첨자 개인정보</strong> — 다루지 않습니다
          </li>
        </ul>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-bold">유의사항</h2>
        <p>
          복권은 <strong>만 19세 이상</strong>만 구매할 수 있습니다. 기대값으로 보면
          구조적으로 손해인 게임이므로, <strong>정해 둔 예산 안에서 재미로만</strong>{" "}
          이용해 주세요.
        </p>
        <p className="mt-2">
          구매를 조절하기 어렵다고 느껴지거나 생활에 지장이 생긴다면{" "}
          <strong>한국도박문제예방치유원(국번 없이 1336)</strong>에서 무료로 상담받을
          수 있습니다. 혼자 감당하지 마세요.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-bold">문의</h2>
        <p>
          제안이나 오류 제보는 생활반장 대표 메일{" "}
          <a
            href="mailto:cdkjjang@gmail.com"
            className="text-accent hover:underline"
          >
            cdkjjang@gmail.com
          </a>
          으로 보내주세요.
        </p>
      </section>

      <p>
        <Link href="/" className="text-accent underline-offset-4 hover:underline">
          홈으로 →
        </Link>
      </p>
    </div>
  );
}
