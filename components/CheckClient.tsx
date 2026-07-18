"use client";

import { useState } from "react";
import { LottoBall } from "@/components/LottoBall";
import {
  checkAllHistory,
  checkDraw,
  rankLabel,
  type CheckResult,
  type HistorySummary,
  type SlimDraw,
} from "@/lib/check";

const ALL = Array.from({ length: 45 }, (_, i) => i + 1);

interface Outcome {
  round: number;
  date: string;
  numbers: number[];
  bonus: number;
  result: CheckResult;
  history: HistorySummary;
  picks: number[];
}

export default function CheckClient({
  draws,
  latestRound,
}: {
  draws: SlimDraw[];
  latestRound: number;
}) {
  const [selected, setSelected] = useState<number[]>([]);
  const [round, setRound] = useState(String(latestRound));
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [error, setError] = useState("");

  function toggle(n: number) {
    setSelected((prev) => {
      if (prev.includes(n)) return prev.filter((x) => x !== n);
      if (prev.length >= 6) return prev; // 최대 6개
      return [...prev, n];
    });
  }

  function check() {
    if (selected.length !== 6) return;
    const roundNum = parseInt(round, 10);
    const draw = draws.find((d) => d.round === roundNum);
    if (!draw) {
      setError(`1 ~ ${latestRound}회 사이의 회차를 입력하세요.`);
      setOutcome(null);
      return;
    }
    setError("");
    const picks = [...selected].sort((a, b) => a - b);
    setOutcome({
      round: draw.round,
      date: draw.date,
      numbers: draw.numbers,
      bonus: draw.bonus,
      result: checkDraw(picks, draw.numbers, draw.bonus),
      history: checkAllHistory(picks, draws),
      picks,
    });
  }

  function reset() {
    setSelected([]);
    setOutcome(null);
    setError("");
  }

  const picksSorted = [...selected].sort((a, b) => a - b);

  return (
    <div>
      {/* 선택한 번호 */}
      <div className="mb-4 flex min-h-[3rem] flex-wrap items-center gap-2 rounded-xl border border-dashed border-border-soft bg-card/50 p-3">
        {picksSorted.length === 0 ? (
          <span className="text-sm text-muted">
            아래에서 내 번호 6개를 선택하세요.
          </span>
        ) : (
          picksSorted.map((n) => <LottoBall key={n} n={n} size="sm" />)
        )}
        <span className="ml-auto text-sm font-semibold text-muted">
          {selected.length}/6
        </span>
      </div>

      {/* 번호 그리드 */}
      <div className="grid grid-cols-7 gap-1.5 sm:grid-cols-9">
        {ALL.map((n) => {
          const on = selected.includes(n);
          const full = selected.length >= 6 && !on;
          return (
            <button
              key={n}
              type="button"
              onClick={() => toggle(n)}
              aria-pressed={on}
              disabled={full}
              className={`h-9 rounded-lg border text-sm font-medium transition-all ${
                on
                  ? "border-accent bg-accent font-bold text-white shadow-md"
                  : full
                    ? "border-border-soft bg-card text-muted/40"
                    : "border-border-soft bg-card hover:border-accent"
              }`}
            >
              {n}
            </button>
          );
        })}
      </div>

      {/* 회차 선택 */}
      <div className="mt-5">
        <label
          htmlFor="check-round"
          className="mb-2 block font-bold"
        >
          확인할 회차
        </label>
        <input
          id="check-round"
          type="number"
          inputMode="numeric"
          min={1}
          max={latestRound}
          value={round}
          onChange={(e) => setRound(e.target.value)}
          className="w-40 rounded-xl border border-border-soft bg-card px-4 py-2.5 text-[15px] shadow-sm focus:border-accent focus:outline-none"
        />
        <span className="ml-2 text-sm text-muted">회 (최신 {latestRound}회)</span>
      </div>

      {/* 버튼 */}
      <div className="mt-5 flex gap-3">
        <button
          type="button"
          onClick={check}
          disabled={selected.length !== 6}
          className="flex-1 rounded-full bg-accent px-5 py-3 font-bold text-white shadow-md transition-all hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-50"
        >
          당첨 확인
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-full border border-border-soft bg-card px-5 py-3 font-semibold hover:border-accent"
        >
          초기화
        </button>
      </div>
      {error && (
        <p className="mt-2 text-sm font-semibold text-[#d14343]">{error}</p>
      )}

      {/* 결과 */}
      {outcome && (
        <section className="mt-6 space-y-5">
          {/* 선택 회차 결과 */}
          <div className="rounded-2xl border border-border-soft bg-card p-5 shadow-sm">
            <p className="text-sm text-muted">
              제 {outcome.round}회 ({outcome.date.replaceAll("-", ".")}) 기준
            </p>
            <p
              className={`mt-1 text-3xl font-extrabold ${
                outcome.result.rank > 0 ? "text-accent" : "text-muted"
              }`}
            >
              {rankLabel(outcome.result.rank)}
            </p>
            <p className="mt-1 text-sm text-muted">
              본번호 {outcome.result.matchCount}개 일치
              {outcome.result.rank === 2 && " + 보너스 일치"}
            </p>

            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold text-muted">
                당첨번호 (내가 맞힌 번호는 강조)
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {outcome.numbers.map((n) => (
                  <span
                    key={n}
                    className={
                      outcome.picks.includes(n)
                        ? "rounded-full ring-2 ring-accent ring-offset-2 ring-offset-card"
                        : "opacity-60"
                    }
                  >
                    <LottoBall n={n} size="md" />
                  </span>
                ))}
                <span className="px-0.5 font-bold text-muted">+</span>
                <span
                  className={
                    outcome.result.bonusMatched
                      ? "rounded-full ring-2 ring-accent ring-offset-2 ring-offset-card"
                      : "opacity-60"
                  }
                >
                  <LottoBall n={outcome.bonus} size="md" />
                </span>
              </div>
            </div>
          </div>

          {/* 역대 전 회차 요약 */}
          <div className="rounded-2xl border border-border-soft bg-card p-5 shadow-sm">
            <h3 className="font-bold">이 번호로 역대 전 회차를 확인하면?</h3>
            <p className="mt-1 text-sm text-muted">
              총 {outcome.history.total.toLocaleString()}회차 대조 결과 (재미로
              보는 참고용)
            </p>
            {outcome.history.best ? (
              <p className="mt-3 text-sm">
                역대 최고 등수:{" "}
                <b className="text-accent">
                  {rankLabel(outcome.history.best.rank)}
                </b>{" "}
                (제 {outcome.history.best.round}회)
              </p>
            ) : (
              <p className="mt-3 text-sm text-muted">
                역대 어떤 회차에서도 5등 이상은 없었습니다.
              </p>
            )}
            <div className="mt-3 grid grid-cols-3 gap-2 text-center sm:grid-cols-6">
              {[1, 2, 3, 4, 5, 0].map((rk) => (
                <div
                  key={rk}
                  className="rounded-lg border border-border-soft bg-background/50 p-2"
                >
                  <p className="text-xs text-muted">{rankLabel(rk)}</p>
                  <p className="font-bold">{outcome.history.counts[rk]}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-muted">
            본 확인 결과는 참고용입니다. 실제 당첨 여부와 당첨금은 반드시
            동행복권(dhlottery.co.kr) 또는 판매점에서 확인하세요.
          </p>
        </section>
      )}
    </div>
  );
}
