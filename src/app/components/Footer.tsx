"use client";

import { useLang, strings } from "@/lib/i18n";
import { EVENT_CONFIG } from "@/lib/config";
import { LangToggle } from "./StickyNav";

export default function Footer() {
  const { lang, setLang } = useLang();
  const s = strings.footer;

  return (
    <footer className="bg-[#0a1b33] text-[#edf3fb] px-6 py-[30px] flex flex-col gap-5 md:px-12">
      <div className="flex items-center justify-between gap-6 flex-wrap">
        {/* Logo */}
        <div className="flex items-center gap-3">
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
            MAKE NO MISTAKES
          </span>
        </div>

        {/* Contact links */}
        <div className="flex gap-5 text-[11.5px] tracking-[0.14em] text-[#a8cef5]">
          <span>MAIL:&nbsp;{EVENT_CONFIG.contactEmail}</span>
          <span>TELEGRAM:&nbsp;{EVENT_CONFIG.contactTelegram}</span>
          <span>X:&nbsp;{EVENT_CONFIG.contactX}</span>
        </div>

        {/* Organized by + lang toggle */}
        <div className="flex items-center gap-4">
          <span className="text-[11px] tracking-[0.12em] text-[#6d93c4] hidden sm:inline">
            {s.organized}
          </span>
          <LangToggle lang={lang} setLang={setLang} variant="dark" />
        </div>
      </div>

      {/* Attribution */}
      <div className="text-[10px] leading-[1.6] text-[#6d93c4] border-t border-[rgba(168,206,245,0.15)] pt-4">
        Syrenka warszawska: autorstwa kreon1974,{" "}
        <a
          href="https://creativecommons.org/licenses/by-sa/3.0"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#6d93c4] underline"
        >
          CC BY-SA 3.0
        </a>
        , via{" "}
        <a
          href="https://commons.wikimedia.org/w/index.php?curid=60680447"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#6d93c4] underline"
        >
          Wikimedia Commons
        </a>
      </div>
    </footer>
  );
}
