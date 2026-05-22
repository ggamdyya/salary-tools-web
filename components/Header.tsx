import Link from "next/link";
import { SITE_NAME } from "@/lib/calculatorsMeta";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur dark:border-[#2C2C2E] dark:bg-[#1C1C1E]/80">
      <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2 font-extrabold">
          <span className="text-xl">🧮</span>
          <span className="text-base text-slate-900 dark:text-white">{SITE_NAME}</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm font-semibold text-juhyu hover:underline dark:text-juhyu-light"
          >
            계산기
          </Link>
          <Link
            href="/blog"
            className="text-sm font-semibold text-slate-600 hover:underline dark:text-slate-300"
          >
            블로그
          </Link>
        </nav>
      </div>
    </header>
  );
}
