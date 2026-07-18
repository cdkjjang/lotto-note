"use client";

import { useState } from "react";
import { LottoBalls } from "@/components/LottoBall";
import { generateGames } from "@/lib/generator";

const ALL = Array.from({ length: 45 }, (_, i) => i + 1);
type Mark = "include" | "exclude" | undefined;
type Mode = "random" | "weighted";

export default function GeneratorClient({ weights }: { weights: number[] }) {
  const [mode, setMode] = useState<Mode>("random");
  const [games, setGames] = useState(5);
  const [marks, setMarks] = useState<Record<number, Mark>>({});
  const [results, setResults] = useState<number[][]>([]);

  const include = ALL.filter((n) => marks[n] === "include");
  const exclude = ALL.filter((n) => marks[n] === "exclude");
  const available = 45 - exclude.length;
  const tooManyIncluded = include.length > 6;
  const tooFewAvailable = available < 6;
  const canGenerate = !tooManyIncluded && !tooFewAvailable;

  function cycle(n: number) {
    setMarks((prev) => {
      const cur = prev[n];
      const next: Mark =
        cur === undefined ? "include" : cur === "include" ? "exclude" : undefined;
      const copy = { ...prev };
      if (next === undefined) delete copy[n];
      else copy[n] = next;
      return copy;
    });
  }

  function generate() {
    if (!canGenerate) return;
    setResults(
      generateGames(games, {
        include,
        exclude,
        weights: mode === "weighted" ? weights : undefined,
      }),
    );
  }

  function reset() {
    setMarks({});
    setResults([]);
  }

  return (
    <div>
      {/* 모드 */}
      <fieldset className="mb-5">
        <legend className="mb-2 font-bold">생성 방식</legend>
        <div className="flex flex-wrap gap-2">
          {(
            [
              { v: "random", label: "완전 랜덤", hint: "모든 번호 동일 확률" },
              { v: "weighted", label: "통계 가중", hint: "많이 나온 번호 위주" },
            ] as const
          ).map((o) => (
            <button
              key={o.v}
              type="button"
              onClick={() => setMode(o.v)}
              aria-pressed={mode === o.v}
              className={`rounded-full border px-4 py-2.5 text-[15px] transition-all ${
                mode === o.v
                  ? "border-accent bg-accent font-semibold text-white shadow-md"
                  : "border-border-soft bg-card hover:border-accent"
              }`}
            >
              {o.label}
              <span
                className={`ml-1 text-xs ${mode === o.v ? "text-white/85" : "text-muted"}`}
              >
                · {o.hint}
              </span>
            </button>
          ))}
        </div>
      </fieldset>

      {/* 게임 수 */}
      <fieldset className="mb-5">
        <legend className="mb-2 font-bold">게임 수</legend>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGames(g)}
              aria-pressed={games === g}
              className={`h-11 w-11 rounded-full border text-[15px] transition-all ${
                games === g
                  ? "border-accent bg-accent font-semibold text-white shadow-md"
                  : "border-border-soft bg-card hover:border-accent"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </fieldset>

      {/* 번호 선택 */}
      <fieldset className="mb-5">
        <legend className="mb-1 font-bold">고정수 · 제외수 (선택)</legend>
        <p className="mb-3 text-sm text-muted">
          번호를 누를 때마다{" "}
          <b className="text-accent">고정</b> → <b className="text-[#d14343]">제외</b>{" "}
          → 해제 순으로 바뀝니다.
        </p>
        <div className="grid grid-cols-7 gap-1.5 sm:grid-cols-9">
          {ALL.map((n) => {
            const mark = marks[n];
            return (
              <button
                key={n}
                type="button"
                onClick={() => cycle(n)}
                aria-pressed={mark !== undefined}
                className={`h-9 rounded-lg border text-sm font-medium transition-all ${
                  mark === "include"
                    ? "border-accent bg-accent/15 font-bold text-accent-strong ring-2 ring-accent"
                    : mark === "exclude"
                      ? "border-[#d14343]/40 bg-[#d14343]/10 text-[#d14343] line-through"
                      : "border-border-soft bg-card hover:border-accent"
                }`}
              >
                {n}
              </button>
            );
          })}
        </div>
        {(include.length > 0 || exclude.length > 0) && (
          <p className="mt-2 text-xs text-muted">
            고정 {include.length}개 · 제외 {exclude.length}개
          </p>
        )}
        {tooManyIncluded && (
          <p className="mt-2 text-xs font-semibold text-[#d14343]">
            고정수는 최대 6개까지 선택할 수 있습니다.
          </p>
        )}
        {tooFewAvailable && (
          <p className="mt-2 text-xs font-semibold text-[#d14343]">
            제외수가 너무 많습니다. 최소 6개 번호가 남아야 합니다.
          </p>
        )}
      </fieldset>

      {/* 버튼 */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={generate}
          disabled={!canGenerate}
          className="flex-1 rounded-full bg-accent px-5 py-3 font-bold text-white shadow-md transition-all hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-50"
        >
          번호 생성
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-full border border-border-soft bg-card px-5 py-3 font-semibold hover:border-accent"
        >
          초기화
        </button>
      </div>

      {/* 결과 */}
      {results.length > 0 && (
        <section className="mt-6 space-y-3">
          {results.map((game, i) => (
            <div
              key={i}
              className="flex flex-wrap items-center gap-3 rounded-xl border border-border-soft bg-card p-3 shadow-sm"
            >
              <span className="w-8 shrink-0 text-sm font-bold text-muted">
                {String.fromCharCode(65 + i)}
              </span>
              <LottoBalls numbers={game} size="md" />
            </div>
          ))}
          <p className="pt-1 text-xs text-muted">
            생성된 번호는 무작위이며 당첨을 보장하지 않습니다.
          </p>
        </section>
      )}
    </div>
  );
}
