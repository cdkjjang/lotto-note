// 로또 6/45 전 회차 당첨 데이터 백필/증분 스크립트.
//
// 데이터 출처: smok95/lotto (https://github.com/smok95/lotto) — GitHub Pages로
// 1회차~최신까지 집계 JSON을 제공하며 매주 자동 갱신된다.
//
// ⚠️ 동행복권 공식 엔드포인트(common.do?method=getLottoNumber)는 WAF가
//    비브라우저 요청을 차단(홈/에러페이지로 리다이렉트)해 node에서 직접 받을 수
//    없다. 당첨번호는 사실(fact)이라 재게시에 제약이 없고, 이 사이트는 정적이라
//    빌드 타임에 한 번 받아 data/draws.json으로 저장한다. 매주 토요일 추첨 후
//    이 스크립트를 다시 돌리면 신규 회차가 추가된다.
//
// 실행: npm run gen:draws

import { writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const SOURCES = [
  "https://smok95.github.io/lotto/results/all.json",
  "https://raw.githubusercontent.com/smok95/lotto/master/results/all.json",
];

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "data");
const OUT_FILE = join(OUT_DIR, "draws.json");

async function fetchSource() {
  let lastErr;
  for (const url of SOURCES) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": "lotto-note-backfill" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) throw new Error("빈 응답");
      console.log(`  ✓ ${url} (${data.length}건)`);
      return data;
    } catch (e) {
      console.warn(`  ✗ ${url} — ${e.message}`);
      lastErr = e;
    }
  }
  throw lastErr ?? new Error("모든 소스 실패");
}

// 원본(smok95) 스키마 → 사이트 내부 스키마로 정규화
function normalize(raw) {
  const round = raw.draw_no;
  const numbers = [...raw.numbers].sort((a, b) => a - b);
  const divisions = (raw.divisions ?? []).map((d) => ({
    prize: d.prize ?? 0,
    winners: d.winners ?? 0,
  }));
  const combo = raw.winners_combination ?? {};
  return {
    round,
    date: String(raw.date).slice(0, 10), // YYYY-MM-DD
    numbers,
    bonus: raw.bonus_no,
    divisions, // [1등..5등] { prize(1게임당), winners }
    totalSales: raw.total_sales_amount ?? 0,
    combination: {
      auto: combo.auto ?? 0,
      semiAuto: combo.semi_auto ?? 0,
      manual: combo.manual ?? 0,
    },
  };
}

function validate(draws) {
  const problems = [];
  const seen = new Set();
  for (const d of draws) {
    if (seen.has(d.round)) problems.push(`중복 회차 ${d.round}`);
    seen.add(d.round);
    if (d.numbers.length !== 6) problems.push(`${d.round}회 번호 ${d.numbers.length}개`);
    for (const n of [...d.numbers, d.bonus]) {
      if (!Number.isInteger(n) || n < 1 || n > 45)
        problems.push(`${d.round}회 범위 밖 번호 ${n}`);
    }
  }
  // 회차 연속성(1..max) 확인
  const max = Math.max(...draws.map((d) => d.round));
  for (let r = 1; r <= max; r++) {
    if (!seen.has(r)) problems.push(`누락 회차 ${r}`);
  }
  return problems;
}

async function main() {
  console.log("로또 데이터 백필 시작…");
  const raw = await fetchSource();

  const draws = raw
    .map(normalize)
    .filter((d) => Number.isInteger(d.round))
    .sort((a, b) => a.round - b.round);

  const problems = validate(draws);
  if (problems.length) {
    console.error(`⚠️ 검증 경고 ${problems.length}건:`);
    for (const p of problems.slice(0, 20)) console.error("   - " + p);
    if (problems.length > 20) console.error(`   … 외 ${problems.length - 20}건`);
  }

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(OUT_FILE, JSON.stringify(draws) + "\n", "utf8");

  const first = draws[0];
  const last = draws[draws.length - 1];
  console.log(
    `✓ 저장 완료: ${draws.length}회차 (${first.round}회 ${first.date} ~ ${last.round}회 ${last.date})`,
  );
  console.log(`  최신 당첨번호: [${last.numbers.join(", ")}] + ${last.bonus}`);
  console.log(`  → ${OUT_FILE}`);
}

main().catch((e) => {
  console.error("백필 실패:", e.message);
  process.exit(1);
});
