import { strings, type Lang } from "@/lib/i18n";

function t(lang: Lang, pl: string, en: string) {
  return lang === "pl" ? pl : en;
}

export default function AgendaSection({ lang }: { lang: Lang }) {
  const s = strings.agenda;

  return (
    <section
      id="agenda"
      className="px-6 py-[60px] flex justify-center md:px-12"
    >
      <div className="w-full max-w-[1240px] flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[12px] tracking-[0.22em] text-[#2e7fd9]">
            {s.sectionLabel}
          </span>
          <h2 className="font-serif text-[32px] lg:text-[40px] font-normal m-0 tracking-[-0.01em]">
            {t(lang, s.heading.pl, s.heading.en)}
          </h2>
        </div>

        {/* Agenda rows */}
        <div className="flex flex-col border-t-2 border-[#0a1b33]">
          {s.rows.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-1 md:grid-cols-[200px_1fr_300px] gap-5 px-1 py-4 border-b border-[rgba(10,27,51,0.25)] items-baseline"
            >
              <span className="font-sans font-bold text-[16px]">
                {t(lang, row.date.pl, row.date.en)}
              </span>
              <span className="text-[13px] leading-[1.6] text-[#4a6c96]">
                {t(lang, row.desc.pl, row.desc.en)}
              </span>
              <span className="text-[11.5px] tracking-[0.12em] text-[#1b549e] md:text-right">
                {row.venue}
              </span>
            </div>
          ))}
        </div>

        {/* Footer row */}
        <div className="flex justify-between items-center gap-5 flex-wrap">
          <span className="text-[11px] tracking-[0.16em] text-[#4a6c96]">
            {t(lang, s.hoursNote.pl, s.hoursNote.en)}
          </span>
          <div className="flex items-center gap-3.5 flex-wrap">
            <span className="text-[12px] text-[#4a6c96]">
              {t(lang, s.workshopNote.pl, s.workshopNote.en)}
            </span>
            <a
              href="#signup"
              className="font-sans font-bold text-[13px] text-[#0a1b33] bg-transparent border-2 border-[#0a1b33] no-underline px-4 py-2 hover:bg-[#a8cef5]"
            >
              {t(lang, s.workshopCta.pl, s.workshopCta.en)}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
