import { strings, type Lang } from "@/lib/i18n";
import { EVENT_CONFIG } from "@/lib/config";

function t(lang: Lang, pl: string, en: string) {
  return lang === "pl" ? pl : en;
}

export default function SponsorsSection({ lang }: { lang: Lang }) {
  const s = strings.sponsors;

  return (
    <section
      id="sponsors"
      className="bg-[#0a1b33] text-[#edf3fb] px-6 py-[60px] flex justify-center md:px-12"
    >
      <div className="w-full max-w-[1240px] flex flex-col gap-8">
        {/* Section label */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[12px] tracking-[0.22em] text-[#a8cef5]">
            {t(lang, s.sectionLabel.pl, s.sectionLabel.en)}
          </span>
        </div>

        {/* Gold / Main Partner */}
        <div className="border-2 border-[rgba(168,206,245,0.5)] px-[30px] py-[38px] flex flex-col gap-4 justify-center items-center">
          <span className="text-[10.5px] tracking-[0.24em] text-[#a8cef5]">
            {s.goldLabel}
          </span>
          <span className="flex items-center gap-3.5">
            <span
              className="inline-block"
              style={{
                width: 0,
                height: 0,
                borderLeft: "17px solid transparent",
                borderRight: "17px solid transparent",
                borderBottom: "29px solid #edf3fb",
              }}
            />
            <span className="font-sans font-bold text-[42px] tracking-[-0.01em]">
              {s.goldName}
            </span>
          </span>
        </div>

        {/* Organizers */}
        <div className="border-[1.5px] border-[rgba(168,206,245,0.4)] px-[30px] py-[26px] flex flex-col gap-3.5 justify-center items-center">
          <span className="text-[10.5px] tracking-[0.24em] text-[#a8cef5]">
            {t(lang, s.organizersLabel.pl, s.organizersLabel.en)}
          </span>
          <span className="flex items-center gap-4 flex-wrap justify-center">
            {/* Prelint logo */}
            <span className="flex items-center gap-[9px]">
              <svg width="22" height="18" viewBox="0 0 32 26">
                <path
                  fill="#edf3fb"
                  fillRule="evenodd"
                  d="M10 24v-4.4C7.5 18 6 15.5 6 12.6 6 7.3 10.3 3 15.6 3h2.8C24.8 3 30 8.2 30 14.6V24h-5v-4h-9v4h-6zm3.2-16.6a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4z"
                />
                <path
                  fill="none"
                  stroke="#edf3fb"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  d="M7 11c-2.6.4-4.5 2.6-4.5 5.3 0 1.9.9 3.5 2.3 4.5"
                />
              </svg>
              <span className="font-serif text-[24px]">prelint</span>
            </span>
            <span className="text-[#a8cef5]">&times;</span>
            {/* Kolektyw3 logo */}
            <span className="flex items-center gap-2">
              <span className="border-2 border-[#a8cef5] px-[7px] py-[2px] font-bold text-[15px]">
                K3
              </span>
              <span className="font-sans font-bold text-[20px]">KOLEKTYW3</span>
            </span>
          </span>
        </div>

        {/* Silver */}
        <div className="flex flex-col gap-3">
          <span className="text-[10.5px] tracking-[0.24em] text-[#6d93c4]">
            {s.silverLabel}
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="border-[1.5px] border-dashed border-[rgba(168,206,245,0.35)] h-[74px] flex items-center justify-center text-[11px] tracking-[0.18em] text-[#6d93c4]"
              >
                [TBA]
              </div>
            ))}
          </div>

          {/* Bronze */}
          <span className="text-[10.5px] tracking-[0.24em] text-[#6d93c4] mt-1.5">
            {s.bronzeLabel}
          </span>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="border-[1.5px] border-dashed border-[rgba(168,206,245,0.25)] h-[56px] flex items-center justify-center text-[10.5px] tracking-[0.18em] text-[#6d93c4]"
              >
                [TBA]
              </div>
            ))}
          </div>
        </div>

        {/* Become a sponsor */}
        <div className="border-2 border-[#2e7fd9] bg-[rgba(46,127,217,0.1)] px-6 py-[30px] lg:px-[34px] grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-center">
          <div className="flex flex-col gap-2.5">
            <h3 className="font-serif text-[24px] lg:text-[28px] font-normal m-0 tracking-[-0.01em]">
              {t(lang, s.becomeHeading.pl, s.becomeHeading.en)}
            </h3>
            <p
              className="text-[12.5px] leading-[1.7] text-[#a8cef5] m-0 max-w-[720px]"
              style={{ textWrap: "pretty" as never }}
            >
              {t(lang, s.becomeDescription.pl, s.becomeDescription.en)}
            </p>
            <span className="text-[11px] text-[#6d93c4]">
              {t(lang, s.becomePartnerNote.pl, s.becomePartnerNote.en)}{" "}
              <a
                href={EVENT_CONFIG.partnerContentUrl}
                className="text-[#a8cef5]"
              >
                {t(lang, s.becomePartnerLink.pl, s.becomePartnerLink.en)}
              </a>
            </span>
          </div>
          <a
            href={EVENT_CONFIG.partnershipUrl}
            className="font-sans font-bold text-[15px] text-[#0a1b33] bg-[#2e7fd9] no-underline px-[26px] py-[15px] whitespace-nowrap hover:bg-[#a8cef5]"
          >
            {t(lang, s.becomeCta.pl, s.becomeCta.en)}
          </a>
        </div>
      </div>
    </section>
  );
}
