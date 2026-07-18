"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RoundJump({ max }: { max: number }) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  function go() {
    const n = parseInt(value, 10);
    if (!Number.isInteger(n) || n < 1 || n > max) {
      setError(`1 ~ ${max}회 사이의 회차를 입력하세요.`);
      return;
    }
    setError("");
    router.push(`/numbers/${n}`);
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="number"
          inputMode="numeric"
          min={1}
          max={max}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") go();
          }}
          placeholder={`회차 입력 (1~${max})`}
          aria-label="회차 번호"
          className="w-full rounded-xl border border-border-soft bg-card px-4 py-2.5 text-[15px] shadow-sm focus:border-accent focus:outline-none"
        />
        <button
          type="button"
          onClick={go}
          className="shrink-0 rounded-xl bg-accent px-5 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-accent-strong"
        >
          이동
        </button>
      </div>
      {error && <p className="mt-2 text-sm font-semibold text-[#d14343]">{error}</p>}
    </div>
  );
}
