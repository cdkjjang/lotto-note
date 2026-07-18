import Link from "next/link";
import FamilyLinks from "@/components/FamilyLinks";
import { SITE_NAME } from "@/lib/site";

const TOOL_LINKS = [
  { href: "/numbers", label: "회차별 당첨번호" },
  { href: "/stats", label: "번호별 통계" },
  { href: "/generator", label: "번호 생성기" },
  { href: "/check", label: "당첨 확인기" },
  { href: "/stories", label: "꿈 해몽·이야기" },
  { href: "/guide", label: "로또 가이드" },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border-soft bg-card">
      <div className="mx-auto max-w-3xl px-4 py-8 text-sm text-muted">
        <nav aria-label="사이트 바로가기" className="mb-5">
          <p className="mb-2 font-semibold text-foreground">{SITE_NAME} 도구</p>
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {TOOL_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-accent">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <FamilyLinks />

        {/* 책임 고지 + 과몰입 예방 (필수) */}
        <div className="mb-3 rounded-lg border border-border-soft bg-background/60 p-3 text-xs leading-relaxed">
          <p className="mb-1 font-semibold text-foreground">
            건전한 이용 안내
          </p>
          <p>
            {SITE_NAME}는 공개된 과거 당첨 데이터를 정리한 <b>참고·오락용</b>{" "}
            서비스입니다. 로또는 매 회차 완전 무작위 추첨으로, 어떤 통계나 생성
            방식도 당첨을 예측하거나 보장하지 않습니다. 복권 구매·판매 기능은
            제공하지 않습니다. 복권은 만 19세 이상만 구매할 수 있으며, 공식
            당첨 결과는 동행복권(dhlottery.co.kr)에서 확인하세요.
          </p>
          <p className="mt-1.5">
            도박 문제로 어려움을 겪고 있다면 한국도박문제예방치유원 상담{" "}
            <a href="tel:1336" className="font-semibold text-accent">
              국번없이 1336
            </a>{" "}
            (24시간)로 도움을 받을 수 있습니다.
          </p>
        </div>

        <div className="flex gap-4">
          <Link href="/about" className="hover:text-accent">
            소개
          </Link>
          <Link href="/terms" className="hover:text-accent">
            이용약관
          </Link>
          <Link href="/privacy" className="hover:text-accent">
            개인정보처리방침
          </Link>
        </div>
        <p className="mt-3">
          © {new Date().getFullYear()} {SITE_NAME}
        </p>
      </div>
    </footer>
  );
}
