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
        <a
          href="https://vercel.com"
          target="_blank"
          rel="noopener noreferrer"
          className="border-2 border-[rgba(168,206,245,0.5)] px-[30px] py-[38px] flex flex-col gap-4 justify-center items-center no-underline text-[#edf3fb] hover:border-[#a8cef5]"
        >
          <span className="text-[10.5px] tracking-[0.24em] text-[#a8cef5]">
            {s.goldLabel}
          </span>
          <span className="flex items-center gap-3.5">
            <svg width="26" height="22" viewBox="0 0 76 65" fill="none">
              <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="#edf3fb" />
            </svg>
            <span className="font-sans font-bold text-[42px] tracking-[-0.01em]">
              {s.goldName}
            </span>
          </span>
        </a>

        {/* Organizers */}
        <div className="border-[1.5px] border-[rgba(168,206,245,0.4)] px-[30px] py-[26px] flex flex-col gap-3.5 justify-center items-center">
          <span className="text-[10.5px] tracking-[0.24em] text-[#a8cef5]">
            {t(lang, s.organizersLabel.pl, s.organizersLabel.en)}
          </span>
          <span className="flex items-center gap-4 flex-wrap justify-center">
            <a
              href="https://prelint.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-[9px] no-underline text-[#edf3fb] hover:text-[#a8cef5]"
            >
              <span className="font-sans font-bold text-[24px] tracking-[-0.02em]">prelint</span>
            </a>
            <span className="text-[#a8cef5]">&times;</span>
            <a
              href="https://kolektyw3.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 no-underline text-[#edf3fb] hover:text-[#a8cef5]"
            >
              <span className="font-sans font-bold text-[20px]">KOLEKTYW3</span>
            </a>
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

        {/* Academic partners */}
        <div className="flex flex-col gap-3">
          <span className="text-[10.5px] tracking-[0.24em] text-[#6d93c4]">
            {t(lang, s.academicLabel.pl, s.academicLabel.en)}
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
        </div>

        {/* Community partners */}
        <div className="flex flex-col gap-3">
          <span className="text-[10.5px] tracking-[0.24em] text-[#6d93c4]">
            {t(lang, s.communityLabel.pl, s.communityLabel.en)}
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
