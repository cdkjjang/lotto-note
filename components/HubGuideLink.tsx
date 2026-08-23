// 생활반장 허브의 상황별 가이드로 연결한다.
// 이 노트 하나로 끝나지 않는 상황(이사·결혼·이직 등)을 순서대로 정리한 글이라,
// 글을 다 읽은 독자에게 자연스러운 다음 단계가 된다.
// 허브가 노트로 보내기만 하고 받지는 못하던 단방향 구조를 메우는 자리이기도 하다.

// windfall-money(이미 목돈이 생긴 뒤)에서 lottery-budget(사는 쪽의 가계 문제)으로
// 바꿨다. 이 노트를 보는 사람 대부분은 아직 당첨 전이고, 예산·확률·과몰입 고지는
// 안전 설계 원칙과도 맞물린다. windfall-money로는 그 글 안에서 이어진다.

const HUB = {
  href: "https://lifebanjang.com/guide/lottery-budget",
  title: "복권에 쓰는 돈, 가계에서 어떻게 볼까",
  desc: "한 달에 얼마를 쓰는지 세어 보고, 확률과 실수령액을 숫자로 확인하는 순서",
};

export default function HubGuideLink() {
  return (
    <section className="mt-8 rounded-2xl border border-border-soft bg-card p-5">
      <p className="text-xs font-bold text-accent-strong">이 상황 전체 흐름 보기</p>
      <a
        href={HUB.href}
        className="mt-2 block font-bold leading-snug underline-offset-4 hover:text-accent hover:underline"
      >
        {HUB.title} →
      </a>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">{HUB.desc}</p>
      <p className="mt-3 text-xs text-muted">
        생활반장 허브 — 여러 노트에 걸친 상황을 한 번에 정리한 글입니다.
      </p>
    </section>
  );
}