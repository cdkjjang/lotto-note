# CLAUDE.md — 로또노트 (lotto-note)

로또 6/45 회차별 당첨번호 조회·번호별 통계·번호 생성기를 제공하는 애드센스
수익형 미니사이트. 생활반장 노트 시리즈. **"예측"이 아니라 "조회·통계·생성"이
핵심** — 아래 안전 설계 원칙을 반드시 지킬 것.

## 스택·명령

- Next.js 16.2.10 (App Router) + TypeScript + Tailwind CSS 4. DB·로그인·결제 없음, 전부 정적.
- 개발 서버: 워크스페이스 `.claude/launch.json`의 `lotto-note-dev` (포트 3500, preview_start 사용)
- 빌드: `npm run build` / 테스트: `npm test` (vitest 39개 — stats·generator·check·guides)
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

## 2026-09-06 가이드 통합 (29 → 20편)

애드센스가 "가치가 별로 없는 콘텐츠"로 두 번 반려했다(워크스페이스 CLAUDE.md 8장).
이 노트는 **"번호를 어떻게 골라도 확률은 같다"는 한 결론을 네 편이 나눠 갖고** 있었고
그중 셋이 1,300자를 넘지 못했다. 29편 중 10편이 1,500자 미만이었다.

| 사라진 글 | 흡수한 글 |
|---|---|
| statistics-myth · most-frequent-numbers · auto-manual | how-to-pick |
| buying-more-odds | odds |
| unclaimed-prize | claim |
| store-license | winning-store |
| online-purchase-rules | how-to-buy |
| history | lottery-fund |
| responsible-play | lotto-scam |

- 사라진 9개 슬러그는 `next.config.ts`의 `redirects()`가 301(308)로 보낸다. **지우지 말 것.**
- `guides-4.ts`는 비어서 삭제됐다. **번호를 재사용하지 말 것** — 새 파일은 `guides-12.ts`부터.
- `responsible-play`가 없어졌지만 **과몰입 신호 목록과 1336 안내는 `lotto-scam`에
  그대로 들어 있다.** 안전 설계 원칙 3번이 걸린 내용이라 `lib/guides.test.ts`가
  1336·만 19세 문구가 최소 5편에 남아 있는지 확인한다.

### ⚠️ 과세최저한은 5만원이 아니라 **건별 200만원**이다

같은 날 발견해 고쳤다. 복권 당첨금은 기타소득 일반 기준(건별 5만원)이 아니라
**소득세법 제84조 제1호의 건별 200만원 이하 비과세**가 적용된다.

점검해 보니 **네 편이 5만원으로 잘못 쓰고 있었고**(`tax`·`pension-lottery-compare`·
`winner-anonymity`·`prize-amount-varies`), 같은 노트의 `lotto-scam`·`online-purchase-rules`는
200만원으로 맞게 쓰고 있어 **한 노트 안에서 서로 어긋난 상태**였다.
`tax`에는 "3등 150만원 → 세금 33만원"이라는 틀린 예시까지 있었다(실제로는 비과세).

`lib/guides.test.ts`가 "5만원 이하 … 비과세" 패턴을 잡아 재발을 막는다.

### 안전 설계 테스트를 조각 매칭으로 짜지 말 것

`guides.test.ts`의 금지 표현 검사는 **부정을 붙일 수 없는 단언 형태만** 본다.
처음에 `확률을 높이는`·`당첨을 예측` 같은 조각으로 걸렀더니
"확률을 높이는 장치가 아니라", "당첨을 예측하는 방법이 아니라"처럼
**오히려 원칙을 지키는 문장 넷이 걸렸다.** 이 노트 본문은 그 표현을 부정문으로 쓴다.

## 2026-09-10 회차 상세를 색인에서 전부 뺐다

예전에는 검색 수요가 있을 법한 **최신 20회차만** 색인을 열어 두었다. 그런데
사이트맵에 제출하는 페이지의 본문 길이를 전수 측정해 보니 **그 20개가 280~290자로
전 사이트에서 가장 얇았다.** 애드센스 반려 사유가 "가치가 별로 없는 콘텐츠"인데
정확히 그 정의에 해당한다. 게다가 "N회 당첨번호"는 동행복권 공식 페이지가 1위라
280자로 이길 자리가 아니다.

- `lib/draws.ts`의 `INDEXED_DRAW_COUNT`를 **20 → 0**으로 내렸다.
  `LAST_NOINDEX_ROUND`가 최신 회차까지 덮어 전 회차가 `noindex, follow`가 된다.
- 사이트맵 URL 52 → **31개**.
- ⚠️ **`slice(-0)`은 배열 전체를 돌려준다**(`-0 === 0`). `app/sitemap.ts`에서
  `INDEXED_DRAW_COUNT > 0` 분기를 지우면 닫으려던 1,200여 개가 통째로 사이트맵에
  들어간다. **그 분기를 유지할 것.**
- `lib/indexing.test.ts`가 셋을 고정한다 — 사이트맵에 회차 0개, 전 회차 noindex,
  그리고 `slice(-0)` 함정. 목록·통계·확인·생성기 페이지는 남아 있는지도 함께 본다.
- `vitest.config.ts`에 `@/*` 별칭을 추가했다. 없으면 테스트가 `app/sitemap.ts`를 못 읽는다.
- ⚠️ **다시 열려면 본문을 먼저 두껍게 해야 한다.** 숫자만 되돌리지 말 것.
- 크롤링 자체는 막지 않는다(robots.txt는 `Allow: /`). 이미 색인된 페이지가
  `noindex`를 읽고 빠져야 하기 때문이다.

## 주의사항

- 통계·생성 로직 수정 시 `lib/*.test.ts`를 함께 갱신할 것 (vitest).
- 브라우저 스크린샷은 이 환경에서 타임아웃 — get_page_text/read_page/javascript_tool로 검증.
- PowerShell은 `&&` 불가 — `;` 또는 `if ($?)` 사용. node 명령마다 PATH 주입 필요.
