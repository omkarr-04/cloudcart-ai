import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>CloudCart AI</title>
        <meta name="description" content="AI-powered commerce platform scaffold" />
      </Head>
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-12 sm:px-10">
          <div className="space-y-8 text-center">
            <p className="text-sm uppercase tracking-[0.4em] text-sky-400">Cloud-native e-commerce SaaS</p>
            <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-6xl">Build commerce with AI, scale with confidence.</h1>
            <p className="mx-auto max-w-3xl text-lg leading-8 text-slate-300">
              CloudCart AI is a production-first monorepo scaffold for frontend, backend services, event-driven workflows, and observability.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/login"
                className="inline-flex rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-400"
              >
                Get started
              </Link>
              <a
                href="#architecture"
                className="inline-flex rounded-full border border-slate-700 bg-slate-900 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500"
              >
                Architecture guide
              </a>
            </div>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2">
            <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/20">
              <h2 className="text-2xl font-semibold text-white">Startup-grade architecture</h2>
              <p className="mt-4 text-slate-300">
                Structured to scale from a modular monolith into microservices with shared contracts and service boundaries.
              </p>
            </section>
            <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/20">
              <h2 className="text-2xl font-semibold text-white">AI recommendation-ready</h2>
              <p className="mt-4 text-slate-300">
                Start with typed service APIs and build product similarity, recommendation, and embedding pipelines later.
              </p>
            </section>
          </div>

          <section id="architecture" className="mt-16 rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/20">
            <h2 className="text-2xl font-semibold text-white">Why this architecture matters</h2>
            <p className="mt-4 text-slate-300">
              A clear separation between UI, auth, API client, shared types, and backend services improves maintainability, reduces coupling, and enables teams to iterate independently.
            </p>
          </section>
        </section>
      </main>
    </>
  );
}
