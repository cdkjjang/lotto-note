// 로또 번호 생성기 — 순수 함수. RNG 주입으로 테스트 가능.
// ⚠️ 어떤 모드도 "당첨 확률"을 높이지 않는다. 통계 가중은 과거 출현이 잦은 번호를
//    조금 더 자주 뽑을 뿐, 다음 추첨과는 무관하다(각 회차는 독립 무작위).
export type Rng = () => number; // [0, 1)

export const PICK_COUNT = 6;
const MIN = 1;
const MAX = 45;

export type GenerateOptions = {
  count?: number; // 뽑을 개수(기본 6)
  exclude?: number[]; // 제외수
  include?: number[]; // 고정수(반드시 포함)
  weights?: number[]; // index 1..45 가중치. 없으면 균등 랜덤.
  rng?: Rng;
};

function clampSet(nums: number[]): Set<number> {
  return new Set(nums.filter((n) => Number.isInteger(n) && n >= MIN && n <= MAX));
}

export function generateNumbers(opts: GenerateOptions = {}): number[] {
  const count = Math.min(Math.max(opts.count ?? PICK_COUNT, 1), MAX);
  const rng = opts.rng ?? Math.random;
  const exclude = clampSet(opts.exclude ?? []);

  // 고정수: 제외수와 겹치면 제외수 우선, count 초과분은 잘라냄
  const include = [...clampSet(opts.include ?? [])].filter(
    (n) => !exclude.has(n),
  );
  const chosen = new Set<number>(include.slice(0, count));

  // 후보 풀 구성
  const pool: number[] = [];
  for (let n = MIN; n <= MAX; n++) {
    if (!exclude.has(n) && !chosen.has(n)) pool.push(n);
  }

  while (chosen.size < count && pool.length > 0) {
    const idx = weightedPick(pool, opts.weights, rng);
    chosen.add(pool[idx]);
    pool.splice(idx, 1);
  }

  return [...chosen].sort((a, b) => a - b);
}

// 여러 게임(줄) 생성
export function generateGames(games: number, opts: GenerateOptions = {}): number[][] {
  return Array.from({ length: Math.max(1, games) }, () => generateNumbers(opts));
}

// pool 에서 가중치에 따라 index 선택. weights 없으면 균등.
function weightedPick(
  pool: number[],
  weights: number[] | undefined,
  rng: Rng,
): number {
  if (!weights) return Math.floor(rng() * pool.length);

  let total = 0;
  const w = pool.map((n) => {
    const val = Math.max(0, weights[n] ?? 0);
    total += val;
    return val;
  });
  if (total <= 0) return Math.floor(rng() * pool.length);

  let r = rng() * total;
  for (let i = 0; i < pool.length; i++) {
    r -= w[i];
    if (r < 0) return i;
  }
  return pool.length - 1;
}

// 테스트·재현용 시드 RNG (mulberry32)
export function seededRng(seed: number): Rng {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
