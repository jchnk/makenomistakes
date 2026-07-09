"use client";

import { useLang, t, strings } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";

function LangToggle({
  lang,
  setLang,
  variant = "light",
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
  variant?: "light" | "dark";
}) {
  const pl = lang === "pl";

  if (variant === "dark") {
    // Footer variant: inverted colors
    return (
      <div className="flex border-[1.5px] border-[#a8cef5] text-[11px] font-bold">
        <button
          onClick={() => setLang("pl")}
          className="border-none cursor-pointer px-[9px] py-1 font-mono font-bold"
          style={{
            background: pl ? "#a8cef5" : "transparent",
            color: pl ? "#0a1b33" : "#a8cef5",
          }}
        >
          PL
        </button>
        <button
          onClick={() => setLang("en")}
          className="border-none cursor-pointer px-[9px] py-1 font-mono font-bold"
          style={{
            background: !pl ? "#a8cef5" : "transparent",
            color: !pl ? "#0a1b33" : "#a8cef5",
          }}
        >
          EN
        </button>
      </div>
    );
  }

  return (
    <div className="flex border-[1.5px] border-[#0a1b33] text-[11.5px] font-bold">
      <button
        onClick={() => setLang("pl")}
        className="border-none cursor-pointer px-2.5 py-[5px] font-mono font-bold"
        style={{
          background: pl ? "#0a1b33" : "transparent",
          color: pl ? "#edf4fc" : "#0a1b33",
        }}
      >
        PL
      </button>
      <button
        onClick={() => setLang("en")}
        className="border-none cursor-pointer px-2.5 py-[5px] font-mono font-bold"
        style={{
          background: !pl ? "#0a1b33" : "transparent",
          color: !pl ? "#edf4fc" : "#0a1b33",
        }}
      >
        EN
      </button>
    </div>
  );
}

export { LangToggle };

export default function StickyNav() {
  const { lang, setLang } = useLang();
  const s = strings.nav;

  const anchors = ["#tracks", "#agenda", "#jury", "#sponsors", "#faq"];

  return (
    <nav
      className="sticky top-0 z-20 flex items-center gap-5 px-6 py-[15px] md:px-12 border-b border-[rgba(10,27,51,0.18)]"
      style={{
        background: "rgba(237,244,252,0.94)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
    >
      {/* Logo */}
      <a
        href="#top"
        className="flex items-center gap-[11px] no-underline text-[#0a1b33]"
      >
        <span
          className="inline-block"
          style={{
            width: 0,
            height: 0,
            borderLeft: "9px solid transparent",
            borderRight: "9px solid transparent",
            borderBottom: "15px solid #2e7fd9",
          }}
        />
        <span className="font-sans font-bold text-[14px] tracking-[0.04em]">
          {s.logo}
        </span>
      </a>

      {/* Links — hidden on small screens */}
      <div className="hidden md:flex gap-[18px] text-[11.5px] tracking-[0.12em] text-[#4a6c96]">
        {s.links.map((link, i) => (
          <a
            key={link}
            href={anchors[i]}
            className="text-[#4a6c96] no-underline hover:text-[#1b549e]"
          >
            {link}
          </a>
        ))}
      </div>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-4">
        <LangToggle lang={lang} setLang={setLang} />
        <a
          href="#signup"
          className="hidden sm:inline-block font-sans font-bold text-[13.5px] text-[#edf4fc] bg-[#2e7fd9] no-underline px-5 py-2.5 hover:bg-[#1b549e]"
        >
          {t(lang, s.cta.pl, s.cta.en)}
        </a>
      </div>
    </nav>
  );
}
