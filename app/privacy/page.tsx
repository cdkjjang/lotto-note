import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: `${SITE_NAME} 개인정보처리방침.`,
};

export default function PrivacyPage() {
  return (
    <div className="space-y-6 text-[15px] leading-relaxed">
      <h1 className="text-2xl font-extrabold">개인정보처리방침</h1>

      <section>
        <h2 className="mb-2 text-lg font-bold">1. 수집하는 개인정보</h2>
        <p>
          {SITE_NAME}는 회원가입, 로그인, 문의 양식을 운영하지 않으며 이용자의
          이름·연락처 등 개인정보를 직접 수집하지 않습니다. 번호 생성기 등 모든
          기능은 이용자의 브라우저 안에서 처리되며, 입력·선택한 값은 서버로
          전송되거나 저장되지 않습니다.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-bold">2. 광고와 쿠키</h2>
        <p>
          {SITE_NAME}는 Google AdSense 등 제3자 광고를 게재할 수 있습니다. 이
          과정에서 Google을 포함한 광고 제공자는 쿠키를 사용해 이용자의 방문
          기록을 바탕으로 맞춤형 광고를 제공할 수 있습니다. 이용자는 Google
          광고 설정(google.com/settings/ads)에서 맞춤형 광고를 해제할 수
          있습니다.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-bold">3. 트래픽 분석</h2>
        <p>
          서비스 개선을 위해 익명화된 방문 통계 도구를 사용할 수 있으며, 이는
          개인을 식별하지 않는 형태로만 활용됩니다.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-bold">4. 문의</h2>
        <p>
          개인정보 관련 문의는{" "}
          <a
            href="mailto:cdkjjang@gmail.com"
            className="text-accent hover:underline"
          >
            cdkjjang@gmail.com
          </a>
          으로 연락해 주세요.
        </p>
      </section>

      <p className="text-xs text-muted">시행일: 2026년 7월 19일</p>
    </div>
  );
}
