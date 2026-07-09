import { strings, type Lang } from "@/lib/i18n";
import { JURY_MEMBERS } from "@/lib/config";

function t(lang: Lang, pl: string, en: string) {
  return lang === "pl" ? pl : en;
}

export default function JurySection({ lang }: { lang: Lang }) {
  const s = strings.jury;

  return (
    <section
      id="jury"
      className="px-6 pt-2 pb-[60px] flex justify-center md:px-12"
    >
      <div className="w-full max-w-[1240px] flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[12px] tracking-[0.22em] text-[#2e7fd9]">
            {t(lang, s.sectionLabel.pl, s.sectionLabel.en)}
          </span>
          <div className="flex justify-between items-baseline gap-5 flex-wrap">
            <h2 className="font-serif text-[32px] lg:text-[40px] font-normal m-0 tracking-[-0.01em]">
              {t(lang, s.heading.pl, s.heading.en)}
            </h2>
            <span className="text-[12px] tracking-[0.12em] text-[#4a6c96]">
              {s.companies}
            </span>
          </div>
        </div>

        {/* Jury cards grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {JURY_MEMBERS.map((j, i) => (
            <div
              key={i}
              className="border-2 border-[#0a1b33] bg-[#edf3fb] flex flex-col"
            >
              {/* Placeholder avatar */}
              <div
                className="aspect-square flex items-center justify-center border-b-2 border-[#0a1b33]"
                style={{
                  background:
                    "repeating-linear-gradient(45deg, rgba(46,127,217,0.14) 0 8px, transparent 8px 16px)",
                }}
              >
                <span className="font-serif text-[34px] text-[#2e7fd9]">
                  ?
                </span>
              </div>
              {/* Info */}
              <div className="px-3 pt-2.5 pb-3 flex flex-col gap-[3px]">
                <span className="font-sans font-bold text-[13px]">
                  {j.name}
                </span>
                <span className="text-[10px] tracking-[0.1em] text-[#4a6c96]">
                  {j.role}
                </span>
                <span className="text-[10.5px] tracking-[0.14em] text-[#2e7fd9] font-bold">
                  {j.company}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
