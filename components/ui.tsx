import { ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-3xl bg-white p-6 shadow-sm dark:bg-[#2C2C2E] ${className}`}>
      {children}
    </div>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return (
    <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
      {children}
    </label>
  );
}

export function Hint({ children }: { children: ReactNode }) {
  return <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">{children}</p>;
}

export function ResultRow({
  label,
  value,
  valueClassName = "",
  large = false,
}: {
  label: ReactNode;
  value: ReactNode;
  valueClassName?: string;
  large?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <span
        className={`font-bold text-slate-900 dark:text-white ${large ? "text-xl" : ""} ${valueClassName}`}
      >
        {value}
      </span>
    </div>
  );
}

export function Divider() {
  return <div className="my-2 h-px bg-slate-200 dark:bg-[#3A3A3C]" />;
}

type HighlightTone = "primary" | "success" | "danger";

const toneStyles: Record<HighlightTone, string> = {
  primary: "bg-indigo-50 text-indigo-900 dark:bg-indigo-900/40 dark:text-white",
  success: "bg-emerald-50 text-emerald-900 dark:bg-emerald-900/40 dark:text-white",
  danger: "bg-red-50 text-red-900 dark:bg-red-900/40 dark:text-white",
};

export function HighlightBox({
  label,
  value,
  tone = "primary",
}: {
  label: ReactNode;
  value: ReactNode;
  tone?: HighlightTone;
}) {
  return (
    <div
      className={`mt-3 flex items-center justify-between rounded-2xl px-5 py-4 ${toneStyles[tone]}`}
    >
      <span className="text-base font-bold">{label}</span>
      <span className="text-2xl font-extrabold">{value}</span>
    </div>
  );
}

export function Disclaimer({ children }: { children: ReactNode }) {
  return (
    <p className="mt-3 px-2 text-center text-xs leading-relaxed text-slate-400">{children}</p>
  );
}

export function CalcHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-5 text-center">
      <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
    </div>
  );
}

export function PrimaryButton({
  children,
  onClick,
  accent = "juhyu",
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  accent?: "juhyu" | "saboheom";
  type?: "button" | "submit";
}) {
  const bg = accent === "juhyu" ? "bg-juhyu" : "bg-saboheom";
  return (
    <button
      type={type}
      onClick={onClick}
      className={`flex-1 rounded-xl ${bg} py-4 text-base font-bold text-white transition-opacity hover:opacity-90 active:opacity-80`}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 rounded-xl bg-slate-100 py-4 text-base font-bold text-slate-700 transition-colors hover:bg-slate-200 dark:bg-[#3A3A3C] dark:text-white"
    >
      {children}
    </button>
  );
}
