import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <label className="block w-full">
      <span className="mb-2 block text-sm font-medium text-slate-200">{label}</span>
      <input
        className={`w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 ${className}`}
        {...props}
      />
      {error ? <p className="mt-2 text-sm text-rose-400">{error}</p> : null}
    </label>
  );
}
