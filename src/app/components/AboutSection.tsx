import { strings, type Lang } from "@/lib/i18n";

function t(lang: Lang, pl: string, en: string) {
  return lang === "pl" ? pl : en;
}

export default function AboutSection({ lang }: { lang: Lang }) {
  const s = strings.about;

  return (
    <section className="px-6 pt-9 pb-14 flex justify-center md:px-12">
      <div className="w-full max-w-[1240px] grid grid-cols-1 lg:grid-cols-[5fr_4fr] gap-12 items-start">
        {/* Left — text */}
        <div className="flex flex-col gap-4">
          <span className="text-[12px] tracking-[0.22em] text-[#2e7fd9]">
            {t(lang, s.sectionLabel.pl, s.sectionLabel.en)}
          </span>
          <h2 className="font-serif text-[32px] lg:text-[40px] font-normal leading-[1.05] m-0 tracking-[-0.01em]">
            {t(lang, s.heading.pl, s.heading.en)}
          </h2>
          <p className="text-[14px] leading-[1.75] text-[#4a6c96] m-0" style={{ textWrap: "pretty" as never }}>
            {t(lang, s.description.pl, s.description.en)}
          </p>
        </div>

        {/* Right — stats grid */}
        <div className="grid grid-cols-2 gap-3.5 pt-0 lg:pt-[34px]">
          {s.stats.map((stat) => (
            <div
              key={stat.value}
              className="border-2 border-[#0a1b33] bg-[#edf3fb] px-[18px] pt-[18px] pb-3.5 flex flex-col gap-1"
            >
              <span className="font-sans font-bold text-[30px] text-[#2e7fd9]">
                {stat.value}
              </span>
              <span className="text-[11px] tracking-[0.14em] text-[#4a6c96]">
                {t(lang, stat.label.pl, stat.label.en)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
