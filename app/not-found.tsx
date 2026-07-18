import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <p className="text-5xl font-extrabold text-accent">404</p>
      <h1 className="mt-4 text-xl font-bold">페이지를 찾을 수 없습니다</h1>
      <p className="mt-2 text-muted">
        주소가 바뀌었거나 존재하지 않는 페이지입니다.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-full bg-accent px-5 py-2.5 font-semibold text-white hover:bg-accent-strong"
      >
        홈으로 가기
      </Link>
    </div>
  );
}
