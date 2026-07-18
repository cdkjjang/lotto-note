# DEPLOY.md — 로또노트 배포 절차

자동차노트(cha-note)와 동일한 방식으로 배포한다.

## 0. 배포 전 확인 (로또 특화)

- [ ] `npm run gen:draws`로 `data/draws.json`이 최신 회차까지 반영됐는지
- [ ] `npm test` (16개) · `npm run build` 통과
- [ ] Footer 면책·과몰입(1336)·만 19세 고지, "예측 아님" 문구가 살아 있는지
- [ ] 애드센스 정책: 도박 콘텐츠 분류 → 한국 게재 허용국. "예측·구매유도" 없음 재확인

## 1. GitHub 저장소 만들기

```powershell
$env:Path = "E:\클로드\tools\node;$env:Path"
cd E:\클로드\lotto-note
git init
git add -A
git commit -F 커밋메시지파일.txt   # 한국어 메시지는 UTF-8 파일로 (git commit -F)
git remote add origin https://github.com/<계정>/lotto-note.git
git push -u origin main
```

## 2. Vercel 연결

1. vercel.com → Add New Project → lotto-note 저장소 Import
2. Framework: Next.js 자동 감지 (vercel.json 있음) → Deploy
3. 이후 배포는 `git push origin main`만 하면 자동

## 3. 도메인 연결 (lotto.lifebanjang.com)

1. Vercel 프로젝트 → Settings → Domains → `lotto.lifebanjang.com` 추가
2. DNS에 CNAME 추가: 이름 `lotto` / 값 `cname.vercel-dns.com`
3. 전파 후 https 자동 적용 확인

## 4. 검색엔진 등록

1. Google Search Console — 속성 추가(lotto.lifebanjang.com), 소유 확인
2. 네이버 서치어드바이저 — 등록 후 발급 코드를 `app/layout.tsx`의
   `metadata.verification.other["naver-site-verification"]`에 추가
3. 두 곳 모두 sitemap 제출: `https://lotto.lifebanjang.com/sitemap.xml`

## 5. 애드센스

1. 애드센스 → 사이트 추가 → lotto.lifebanjang.com (lifebanjang.com이 이미
   승인돼 있으면 하위 도메인 추가로 처리)
2. **심사 시 유의**: 도박 콘텐츠 분류 항목이므로, 승인 전 면책·연령·과몰입
   고지와 정보성 페이지(가이드·통계)가 충실한지 확인
3. 승인 후 Vercel 환경변수 `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-...` 설정
4. AdSlot 배치의 임시 slot 번호(1111.../2222.../3333.../4444...)를 애드센스
   콘솔 발급 번호로 교체

## 6. 허브 연동 (배포 후)

배포로 서브도메인이 살아난 뒤에 진행 (죽은 링크 카드 방지):

1. `lifebanjang-hub/lib/notes.ts`에 로또노트 항목 추가 (`status: "live"`)
2. 형제 노트들의 `components/FamilyLinks.tsx`에 로또노트 링크 추가 (선택)
3. 각 저장소에서 `git push origin main`

## 7. 주간 갱신 (매주 토요일 추첨 후)

```powershell
$env:Path = "E:\클로드\tools\node;$env:Path"
cd E:\클로드\lotto-note
npm run gen:draws
git add data/draws.json
git commit -F 커밋메시지파일.txt
git push origin main
```
