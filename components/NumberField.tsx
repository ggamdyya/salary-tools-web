"use client";

import { Label, Hint } from "./ui";

export function NumberField({
  label,
  value,
  onChange,
  suffix,
  placeholder,
  hint,
  accent = "juhyu",
}: {
  label: string;
  value: string;
  onChange: (raw: string) => void;
  suffix?: string;
  placeholder?: string;
  hint?: string;
  accent?: "juhyu" | "saboheom";
}) {
  const ring = accent === "juhyu" ? "focus:border-juhyu" : "focus:border-saboheom";
  return (
    <div className="mb-4">
      <Label>{label}</Label>
      <div className="relative">
        <input
          inputMode="numeric"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-xl border-[1.5px] border-slate-200 bg-white px-4 py-3.5 text-lg text-slate-900 outline-none transition-colors dark:border-[#3A3A3C] dark:bg-[#2C2C2E] dark:text-white ${ring}`}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
            {suffix}
          </span>
        )}
      </div>
      {hint && <div className="mt-1.5"><Hint>{hint}</Hint></div>}
    </div>
  );
}

export function SelectField<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="mb-4">
      <Label>{label}</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full appearance-none rounded-xl border-[1.5px] border-slate-300 bg-white px-4 py-3.5 text-base text-slate-900 outline-none dark:border-[#3A3A3C] dark:bg-[#2C2C2E] dark:text-white"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
