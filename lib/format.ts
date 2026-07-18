// 표시용 포맷 헬퍼
export function formatDate(iso: string): string {
  // "2026-07-18" -> "2026.07.18"
  return iso.replaceAll("-", ".");
}

export function formatWon(won: number): string {
  if (won >= 100_000_000) {
    const eok = won / 100_000_000;
    const val = eok >= 100 ? String(Math.round(eok)) : eok.toFixed(1).replace(/\.0$/, "");
    return `${val}억원`;
  }
  if (won >= 10_000) return `${Math.round(won / 10_000).toLocaleString()}만원`;
  return `${won.toLocaleString()}원`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString();
}
