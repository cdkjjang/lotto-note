import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "소개",
  description: `${SITE_NAME} 서비스 소개와 데이터 출처, 이용 시 유의사항.`,
};

export default function AboutPage() {
  return (
    <div className="space-y-6 text-[15px] leading-relaxed">
      <h1 className="text-2xl font-extrabold">{SITE_NAME} 소개</h1>

      <p>
        {SITE_NAME}는 로또 6/45의 역대 당첨번호와 번호별 통계를 쉽게 확인하고,
        재미로 번호를 뽑아볼 수 있는 무료 도구입니다. 회원가입이나 개인정보
        입력 없이 누구나 바로 사용할 수 있습니다. 생활 속 애매한 문제를 해결하는{" "}
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
          <li>당첨 확률·세금·수령 방법 가이드</li>
        </ul>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-bold">데이터 출처</h2>
        <p>
          당첨 데이터는 공개된 과거 추첨 결과를 정리한 것입니다. 공식 당첨 결과와
          최신 정보는 동행복권(dhlottery.co.kr)에서 확인할 수 있으며,{" "}
          {SITE_NAME}는 정보의 정확성을 보증하지 않습니다.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-bold">유의사항</h2>
        <p>
          로또는 매 회차가 완전히 독립적인 무작위 추첨입니다. {SITE_NAME}의 통계와
          번호 생성기는 당첨을 예측하거나 보장하지 않으며, 어떤 방식으로도 당첨
          확률을 높여주지 않습니다. 복권은 만 19세 이상만 구매할 수 있고,{" "}
          {SITE_NAME}는 복권 판매·구매 기능을 제공하지 않습니다. 정해둔 예산
          안에서 재미로만 이용해 주세요.
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
    </div>
  );
}
