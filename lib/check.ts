// 로또 당첨 확인 — 순수 함수. 내 번호(6개)를 특정 회차/전 회차와 대조한다.
// 등수 규칙: 6개=1등, 5개+보너스=2등, 5개=3등, 4개=4등, 3개=5등, 그 외 낙첨.

export interface SlimDraw {
  round: number;
  date: string;
  numbers: number[]; // 당첨번호 6개
  bonus: number;
}

export interface CheckResult {
  rank: number; // 0=낙첨, 1~5=등수
  matchCount: number; // 본번호 일치 개수
  matched: number[]; // 일치한 내 번호(본번호)
  bonusMatched: boolean; // 남은 번호가 보너스와 일치(2등 판정용)
}

export function checkDraw(
  picks: number[],
  numbers: number[],
  bonus: number,
): CheckResult {
  const winSet = new Set(numbers);
  const matched = picks.filter((n) => winSet.has(n));
  const matchCount = matched.length;
  // 당첨번호 6개와 보너스는 서로 겹치지 않으므로, 일치하지 않은 내 번호만
  // 보너스와 비교하면 된다.
  const bonusMatched = picks.includes(bonus);

  let rank = 0;
  if (matchCount === 6) rank = 1;
  else if (matchCount === 5 && bonusMatched) rank = 2;
  else if (matchCount === 5) rank = 3;
  else if (matchCount === 4) rank = 4;
  else if (matchCount === 3) rank = 5;

  return { rank, matchCount, matched, bonusMatched };
}

export interface HistorySummary {
  counts: number[]; // index 0=낙첨, 1~5=각 등수 횟수
  best: { rank: number; round: number; date: string } | null;
  total: number;
}

// 내 번호를 전 회차와 대조해 등수 분포와 역대 최고 등수를 낸다.
export function checkAllHistory(
  picks: number[],
  draws: SlimDraw[],
): HistorySummary {
  const counts = [0, 0, 0, 0, 0, 0];
  let best: HistorySummary["best"] = null;

  for (const d of draws) {
    const { rank } = checkDraw(picks, d.numbers, d.bonus);
    counts[rank]++;
    if (rank !== 0 && (best === null || rank < best.rank)) {
      best = { rank, round: d.round, date: d.date };
    }
  }

  return { counts, best, total: draws.length };
}

export function rankLabel(rank: number): string {
  return rank === 0 ? "낙첨" : `${rank}등`;
}
