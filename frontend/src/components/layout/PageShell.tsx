import type { ReactNode } from 'react';

interface PageShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function PageShell({ title, subtitle, children }: PageShellProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-12 md:px-10">
        <header className="mb-12 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-400">CloudCart AI</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-5xl">{title}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">{subtitle}</p>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
