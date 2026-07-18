// 로또 번호 공 — 동행복권 공식 색상 구간을 따른다.
//   1~10 노랑 · 11~20 파랑 · 21~30 빨강 · 31~40 회색 · 41~45 초록
function ballColor(n: number): string {
  if (n <= 10) return "bg-[#fbc400] text-black";
  if (n <= 20) return "bg-[#69c8f2] text-black";
  if (n <= 30) return "bg-[#ff7272] text-white";
  if (n <= 40) return "bg-[#a0a0a0] text-white";
  return "bg-[#b0d840] text-black";
}

const SIZES = {
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-base",
  lg: "h-12 w-12 text-lg",
} as const;

export function LottoBall({
  n,
  size = "md",
}: {
  n: number;
  size?: keyof typeof SIZES;
}) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-bold shadow-sm ${ballColor(
        n,
      )} ${SIZES[size]}`}
    >
      {n}
    </span>
  );
}

// 당첨번호 6개 + (선택) 보너스번호 한 줄
export function LottoBalls({
  numbers,
  bonus,
  size = "md",
}: {
  numbers: number[];
  bonus?: number;
  size?: keyof typeof SIZES;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
      {numbers.map((n) => (
        <LottoBall key={n} n={n} size={size} />
      ))}
      {bonus !== undefined && (
        <>
          <span className="px-0.5 text-lg font-bold text-muted" aria-hidden>
            +
          </span>
          <span className="sr-only">보너스</span>
          <LottoBall n={bonus} size={size} />
        </>
      )}
    </div>
  );
}
