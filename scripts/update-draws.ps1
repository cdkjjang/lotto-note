# 로또노트 당첨번호 주간 자동 갱신 — Windows 작업 스케줄러가 실행 (매주 일요일 오전)
#
#   1. npm run gen:draws 로 smok95 미러에서 data/draws.json을 다시 받는다
#   2. 최신 회차가 늘었을 때만 vitest + next build 로 검증한다
#   3. 통과하면 draws.json 한 파일만 커밋하고 git push origin main (Vercel 자동 배포)
#
# 새 회차가 없거나 어느 단계든 실패하면 draws.json을 되돌리고 커밋하지 않는다.
# 실패는 logs\FAILED.txt 로 남긴다. 스케줄러 결과만 봐서는 알아채기 어렵다.
#
# ⚠️ 7월 구축 후 '매주 손으로' 하기로 했던 갱신이 한 번도 안 돌아 10-29에 1247회까지
#    몰아 갱신했다. 그래서 자동화했다. 이 파일은 UTF-8 BOM으로 저장할 것(PS 5.1).

$ErrorActionPreference = 'Continue'
$env:Path = "E:\클로드\tools\node;$env:Path"
$repo = "E:\클로드\lotto-note"
Set-Location $repo

$logDir = Join-Path $repo "logs"
if (-not (Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir | Out-Null }
$log = Join-Path $logDir "update-draws.log"
$flag = Join-Path $logDir "FAILED.txt"
$data = "data/draws.json"

function Log([string]$msg) { $msg | Out-File -FilePath $log -Append -Encoding utf8 }

function LatestRound {
  $r = & node -e "const d=require('./data/draws.json');console.log(d[d.length-1].round)"
  if ($LASTEXITCODE -ne 0) { return $null }
  return [int]$r
}

function Finish([int]$code, [string]$failMsg) {
  if ($failMsg) {
    Log "[실패] $failMsg"
    "$(Get-Date -Format 'yyyy-MM-dd HH:mm') 로또 데이터 갱신 실패 — $failMsg (logs\update-draws.log 확인)" |
      Out-File -FilePath $flag -Encoding utf8
  } elseif (Test-Path $flag) {
    Remove-Item $flag -Force   # 직전 실패가 회복되면 표식을 지운다
  }
  Log "===== $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') 종료 (코드 $code) ====="
  exit $code
}

function Revert { & git checkout -- $data 2>&1 | Out-File -FilePath $log -Append -Encoding utf8 }

Log "===== $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') 시작 ====="

# 사전 점검 — main 브랜치이고 draws.json에 커밋 안 된 수정이 없어야 한다.
# (손으로 고치던 중이면 되돌리기 단계가 그 수정을 날려 버린다)
$branch = (& git rev-parse --abbrev-ref HEAD).Trim()
if ($branch -ne 'main') { Finish 1 "현재 브랜치가 main이 아니다($branch)" }
if (& git status --porcelain -- $data) { Finish 1 "$data 에 커밋 안 된 수정이 있다 — 손으로 정리한 뒤 다시 실행" }

$before = LatestRound
if (-not $before) { Finish 1 "기존 $data 를 읽지 못했다" }
Log "기존 최신 회차: $before"

& npm run gen:draws 2>&1 | Out-File -FilePath $log -Append -Encoding utf8
if ($LASTEXITCODE -ne 0) { Revert; Finish 1 "gen:draws 실패 (미러 응답 확인)" }

$after = LatestRound
if (-not $after) { Revert; Finish 1 "새로 받은 $data 를 읽지 못했다" }
Log "받은 최신 회차: $after"

if ($after -le $before) {
  # 미러가 아직 갱신 전이거나(토요일 밤 반영 지연) 회차가 줄어든 이상 응답.
  # 옛 회차 수치만 바뀐 변경도 커밋하지 않는다.
  Revert
  if ($after -lt $before) { Finish 1 "받은 회차($after)가 기존($before)보다 적다 — 미러 이상" }
  Log "새 회차 없음 — 커밋하지 않음"
  Finish 0 $null
}

Log "--- vitest ---"
& npx vitest run 2>&1 | Out-File -FilePath $log -Append -Encoding utf8
if ($LASTEXITCODE -ne 0) { Revert; Finish 1 "vitest 실패 ($after 회)" }

Log "--- next build ---"
& npm run build 2>&1 | Out-File -FilePath $log -Append -Encoding utf8
if ($LASTEXITCODE -ne 0) { Revert; Finish 1 "next build 실패 ($after 회)" }

$date = (& node -e "const d=require('./data/draws.json');console.log(d[d.length-1].date)").Trim()
$msgFile = Join-Path $logDir "commit-msg.txt"
$msgLines = @(
  "당첨번호 데이터 ${after}회($date)까지 자동 갱신",
  "",
  "scripts/update-draws.ps1 (작업 스케줄러 주간 실행). 직전 ${before}회.",
  "",
  "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
)
# BOM 없는 UTF-8로 쓴다 — BOM이 있으면 커밋 메시지 첫 글자에 섞인다
[System.IO.File]::WriteAllLines($msgFile, $msgLines, (New-Object System.Text.UTF8Encoding $false))

# 경로를 지정해 커밋하면 다른 파일이 스테이징돼 있어도 draws.json만 들어간다
& git commit -F $msgFile -- $data 2>&1 | Out-File -FilePath $log -Append -Encoding utf8
if ($LASTEXITCODE -ne 0) { Revert; Finish 1 "git commit 실패" }

& git push origin main 2>&1 | Out-File -FilePath $log -Append -Encoding utf8
if ($LASTEXITCODE -ne 0) {
  # 커밋은 로컬에 남는다. 다음 실행 때 새 회차가 있으면 함께 올라가고, 손으로 push해도 된다.
  Finish 1 "git push 실패 — 로컬 커밋만 있음 (${after}회)"
}

Log "${before}회 → ${after}회 커밋·푸시 완료"
Finish 0 $null
