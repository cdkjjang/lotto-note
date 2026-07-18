# CLAUDE.md — 로또노트 (lotto-note)

로또 6/45 회차별 당첨번호 조회·번호별 통계·번호 생성기를 제공하는 애드센스
수익형 미니사이트. 생활반장 노트 시리즈. **"예측"이 아니라 "조회·통계·생성"이
핵심** — 아래 안전 설계 원칙을 반드시 지킬 것.

## 스택·명령

- Next.js 16.2.10 (App Router) + TypeScript + Tailwind CSS 4. DB·로그인·결제 없음, 전부 정적.
- 개발 서버: 워크스페이스 `.claude/launch.json`의 `lotto-note-dev` (포트 3500, preview_start 사용)
- 빌드: `npm run build` / 테스트: `npm test` (vitest 25개 — stats·generator·check)
- 데이터 백필/갱신: `npm run gen:draws` (scripts/fetch-draws.mjs)
- Node는 포터블: 명령 앞에 `$env:Path = "E:\클로드\tools\node;$env:Path"` 필요
- 배포: `git push origin main` (Vercel 자동 배포)만 사용. 절차는 `DEPLOY.md`
- 도메인: lotto.lifebanjang.com (배포 후 허브 `lib/notes.ts` 및 형제 노트 FamilyLinks에 등록)

## 데이터 파이프라인 (중요)

- **출처: smok95/lotto** (https://github.com/smok95/lotto) — GitHub Pages로 1회차~최신
  집계 JSON(all.json) 제공, 매주 자동 갱신. `scripts/fetch-draws.mjs`가 이를 받아
  `data/draws.json`으로 정규화 저장.
- ⚠️ **동행복권 공식 엔드포인트(common.do?method=getLottoNumber)는 WAF가 비브라우저
  요청을 차단**(홈/errorPage로 리다이렉트)해 node·서버에서 직접 못 받는다. 세션 쿠키를
  갖춰도 마찬가지. 그래서 GitHub 미러를 쓴다. 당첨번호는 사실(fact)이라 재게시 제약 없음.
- **주간 갱신**: 매주 토요일 추첨 후 `npm run gen:draws` 재실행 → `data/draws.json`
  갱신 → 커밋 → `git push`. 정적 사이트라 이 흐름만으로 최신 회차가 반영된다.
- `data/draws.json` 스키마: `{ round, date, numbers[6], bonus, divisions[5]{prize,winners}, totalSales, combination{auto,semiAuto,manual} }`

## 구조

- `lib/draws.ts` — data/draws.json 로더 + 타입 (draws, latestDraw, getDraw, recentDraws)
- `lib/stats.ts` (+ `stats.test.ts`) — 순수 통계 함수: frequencyMap/hot/cold/roundsSinceLast/분포/frequencyWeights
- `lib/generator.ts` (+ `generator.test.ts`) — 순수 번호 생성: generateNumbers/generateGames, 시드 RNG. include/exclude/weights 지원
- `lib/check.ts` (+ `check.test.ts`) — 당첨 확인: checkDraw(등수 판정)·checkAllHistory(역대 분포). SlimDraw로 클라이언트 전달
- `lib/format.ts` — 날짜·금액 포맷 · `lib/guides*.ts`·`lib/dreams.ts` — 콘텐츠 데이터
- `components/LottoBall.tsx` — 동행복권 공식 색상 구간 번호 공
- `components/GeneratorClient.tsx`·`CheckClient.tsx` — 생성기·확인기 UI(클라이언트). 대용량 데이터는 서버에서 슬림/가중치로 가공해 prop 전달
- `components/RoundJump.tsx` — 회차 바로가기 입력(useRouter)
- 페이지: `app/numbers`(조회)+`[round]`(회차 상세 SSG)·`app/stats`·`app/generator`·`app/check`(당첨확인)·`app/stories`(꿈해몽)·`app/guide`+`[slug]`·about/privacy/terms
- 애드센스: `components/AdSlot.tsx` — `NEXT_PUBLIC_ADSENSE_CLIENT` 설정 전에는 아무것도 렌더링 안 함

## 안전 설계 원칙 (애드센스 계정 보호 — 위반 금지)

로또는 애드센스 **"도박 콘텐츠"**로 분류된다. 한국은 게재 허용국이지만, 위반 시
같은 퍼블리셔 ID의 다른 노트(이사·자동차 등)까지 위험하다. 반드시:

1. **"예측·적중 보장·무조건 1등" 류 표현 금지.** "조회·통계·생성·재미"로만.
2. **복권 구매·판매·베팅 기능/유도 금지.** 외부 도박 사이트 제휴 링크 금지.
3. **면책·과몰입 고지 상시 노출** (Footer): 무작위·당첨 미보장, 만 19세, 도박문제 1336.
4. **통계·생성은 확률을 높이지 않는다**는 문구를 stats·generator 페이지에 유지.
5. 데이터는 공식 아님 고지 + 동행복권 확인 안내 유지.

## 주의사항

- 통계·생성 로직 수정 시 `lib/*.test.ts`를 함께 갱신할 것 (vitest).
- 브라우저 스크린샷은 이 환경에서 타임아웃 — get_page_text/read_page/javascript_tool로 검증.
- PowerShell은 `&&` 불가 — `;` 또는 `if ($?)` 사용. node 명령마다 PATH 주입 필요.
