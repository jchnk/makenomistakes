import SignupForm from "./components/SignupForm";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#e6eef6] font-mono text-[#0a2a3a]">
      {/* Bullseye backdrop */}
      <div className="pointer-events-none absolute top-[46%] left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="h-[1000px] w-[1000px] rounded-full border-[1.5px] border-[rgba(157,184,214,0.45)]" />
      </div>
      <div className="pointer-events-none absolute top-[46%] left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="h-[720px] w-[720px] rounded-full border-[1.5px] border-[rgba(157,184,214,0.55)]" />
      </div>
      <div className="pointer-events-none absolute top-[46%] left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="h-[460px] w-[460px] rounded-full border-[1.5px] border-[rgba(14,122,115,0.45)]" />
      </div>
      {/* Crosshair */}
      <div className="pointer-events-none absolute top-[46%] left-[8%] right-[8%] h-px -translate-y-1/2 bg-[rgba(157,184,214,0.45)]" />
      <div className="pointer-events-none absolute left-1/2 top-[6%] bottom-[6%] w-px -translate-x-1/2 bg-[rgba(157,184,214,0.45)]" />

      {/* Top bar */}
      <header className="relative z-10 flex items-center border-b border-[rgba(157,184,214,0.5)] px-6 py-[30px] sm:px-12">
        <div className="flex items-center gap-3">
          <span className="relative inline-flex h-[22px] w-[22px] items-center justify-center rounded-full border-2 border-[#0e7a73]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#cc1e8f]" />
          </span>
          <span className="font-sans text-base font-bold tracking-[-0.01em]">
            Make No Mistakes
          </span>
        </div>
        <div className="ml-auto hidden items-center gap-7 text-[13px] text-[#5a6a72] sm:flex">
          <span>AI Hackathon</span>
          <span>Sept 2026</span>
          <span className="inline-flex items-center gap-[7px] text-[#0e7a73]">
            <span className="h-2 w-2 rounded-full bg-[#45cfa3] shadow-[0_0_10px_#45cfa3]" />
            registration opening
          </span>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center sm:px-12">
        {/* Badge pill */}
        <div className="inline-flex items-center gap-[9px] rounded-full border border-[rgba(157,184,214,0.6)] bg-[rgba(255,255,255,0.7)] px-4 py-[7px] text-xs uppercase tracking-[0.18em] text-[#5a6a72]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#cc1e8f]" />
          Coming soon · 12.09.2026
        </div>

        {/* H1 */}
        <h1 className="mt-[26px] font-sans text-[44px] font-bold leading-[0.92] tracking-[-0.04em] text-[#0a2a3a] sm:text-[64px] lg:text-[96px]">
          Make No
          <br />
          Mistakes
        </h1>

        {/* Paragraph */}
        <p className="mt-6 max-w-[540px] text-base leading-relaxed text-[#41525c]">
          36-godzinny hackathon AI dla tych, którzy budują precyzyjnie. Zero
          halucynacji, zero excusów — sam celny kod.
        </p>

        {/* Signup form */}
        <SignupForm />

        {/* Micro text */}
        <p className="mt-4 text-xs text-[#7a8893]">
          247 miejsc · bez spamu, jeden mail gdy ruszamy.
        </p>
      </main>

      {/* Footer */}
      <footer className="relative z-10 flex items-center justify-between border-t border-[rgba(157,184,214,0.5)] px-6 py-[22px] text-xs text-[#5a6a72] sm:px-12">
        <span className="tracking-[0.06em]">© 2026 · MAKE NO MISTAKES</span>
        <span>accuracy 100.0% · defect rate 0%</span>
      </footer>
    </div>
  );
}
