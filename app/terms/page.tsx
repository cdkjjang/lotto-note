import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "이용약관",
  description: `${SITE_NAME} 이용약관.`,
};

export default function TermsPage() {
  return (
    <div className="space-y-6 text-[15px] leading-relaxed">
      <h1 className="text-2xl font-extrabold">이용약관</h1>

      <section>
        <h2 className="mb-2 text-lg font-bold">1. 서비스의 성격</h2>
        <p>
          {SITE_NAME}는 로또 6/45의 공개된 과거 당첨 데이터를 정리해 제공하고,
          번호 통계 및 번호 생성 기능을 제공하는 <b>정보·오락용</b>{" "}
          서비스입니다. {SITE_NAME}는 복권의 판매·구매·중개를 하지 않으며,
          복권 사업자와 아무런 제휴 관계가 없습니다.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-bold">2. 당첨 예측·보장의 부인</h2>
        <p>
          로또는 매 회차가 독립적인 완전 무작위 추첨입니다. {SITE_NAME}가
          제공하는 통계와 생성 번호는 어떤 경우에도 당첨을 예측하거나 보장하지
          않으며, 당첨 확률을 높여주지 않습니다. 이용자는 이를 이해하고
          참고용으로만 이용하는 데 동의합니다.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-bold">3. 정보의 정확성</h2>
        <p>
          {SITE_NAME}는 데이터의 정확성과 최신성을 위해 노력하지만 이를 보증하지
          않습니다. 공식 당첨 결과와 규정은 반드시 동행복권(dhlottery.co.kr)에서
          확인하시기 바랍니다. 데이터 오류로 인한 손해에 대해 {SITE_NAME}는
          책임지지 않습니다.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-bold">4. 건전한 이용과 연령</h2>
        <p>
          복권은 만 19세 이상만 구매할 수 있습니다. {SITE_NAME}는 과도한 사행성
          이용을 권장하지 않으며, 이용자는 자신의 판단과 책임하에 정해둔 예산
          안에서 이용해야 합니다.
        </p>
      </section>

      <p className="text-xs text-muted">시행일: 2026년 7월 19일</p>
    </div>
  );
}
