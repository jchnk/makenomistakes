"use client";

import { useState } from "react";
import { useLang, t, strings } from "@/lib/i18n";

export default function RulesFaqSection() {
  const { lang } = useLang();
  const s = strings.rulesFaq;
  const [openFaq, setOpenFaq] = useState(-1);

  const faqItems =
    lang === "pl" ? s.faq.pl : s.faq.en;

  return (
    <section
      id="faq"
      className="px-6 py-[60px] flex justify-center md:px-12"
    >
      <div className="w-full max-w-[1240px] grid grid-cols-1 lg:grid-cols-[4fr_6fr] gap-12 items-start">
        {/* Left — rules */}
        <div className="flex flex-col gap-4">
          <span className="text-[12px] tracking-[0.22em] text-[#2e7fd9]">
            {t(lang, s.sectionLabel.pl, s.sectionLabel.en)}
          </span>
          <h2 className="font-serif text-[32px] lg:text-[40px] font-normal m-0 tracking-[-0.01em]">
            {t(lang, s.heading.pl, s.heading.en)}
          </h2>
          <div className="flex flex-col gap-2.5 mt-1.5">
            {s.rules.map((rule, i) => (
              <div
                key={i}
                className="flex items-baseline gap-2.5 text-[13px] text-[#4a6c96]"
              >
                <span className="text-[#2e7fd9] font-bold">&rarr;</span>
                {t(lang, rule.pl, rule.en)}
              </div>
            ))}
          </div>
        </div>

        {/* Right — FAQ accordion */}
        <div className="flex flex-col border-t-2 border-[#0a1b33]">
          {faqItems.map((item, i) => (
            <div key={i} className="border-b border-[rgba(10,27,51,0.25)]">
              <button
                onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                className="w-full flex justify-between items-center gap-4 border-none bg-transparent cursor-pointer text-left font-sans font-bold text-[15px] text-[#0a1b33] px-1 py-[15px]"
              >
                <span>{item.q}</span>
                <span className="text-[#2e7fd9] font-mono text-[16px]">
                  {openFaq === i ? "−" : "+"}
                </span>
              </button>
              {openFaq === i && (
                <div className="text-[13px] leading-[1.7] text-[#4a6c96] px-1 pb-4 max-w-[640px]">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
