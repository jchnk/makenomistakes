import { strings, type Lang } from "@/lib/i18n";

function t(lang: Lang, pl: string, en: string) {
  return lang === "pl" ? pl : en;
}

export default function TracksSection({ lang }: { lang: Lang }) {
  const s = strings.tracks;

  return (
    <section
      id="tracks"
      className="bg-[#0a1b33] text-[#edf3fb] px-6 py-[60px] flex justify-center md:px-12"
    >
      <div className="w-full max-w-[1240px] flex flex-col gap-7">
        {/* Header row */}
        <div className="flex justify-between items-baseline gap-5 flex-wrap">
          <div className="flex flex-col gap-2.5">
            <span className="text-[12px] tracking-[0.22em] text-[#a8cef5]">
              {t(lang, s.sectionLabel.pl, s.sectionLabel.en)}
            </span>
            <h2 className="font-serif text-[32px] lg:text-[40px] font-normal m-0 tracking-[-0.01em]">
              {t(lang, s.heading.pl, s.heading.en)}
            </h2>
          </div>
          <span className="text-[12px] tracking-[0.14em] text-[#a8cef5]">
            {t(lang, s.prizesNote.pl, s.prizesNote.en)}
          </span>
        </div>

        {/* Track cards grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[18px]">
          {s.items.map((track) => (
            <div
              key={track.num}
              className="border-[1.5px] border-[rgba(168,206,245,0.4)] bg-[rgba(46,127,217,0.08)] px-[26px] pt-6 pb-5 flex flex-col gap-2.5"
            >
              <div className="flex justify-between items-baseline">
                <span className="text-[11.5px] tracking-[0.2em] text-[#2e7fd9] font-bold">
                  TRACK&nbsp;{track.num}
                </span>
                <span className="text-[10.5px] tracking-[0.14em] text-[#a8cef5] border border-[rgba(168,206,245,0.5)] px-2 py-[3px]">
                  [TBA]&nbsp;PRIZE
                </span>
              </div>
              <span className="font-sans font-bold text-[21px] tracking-[-0.01em]">
                {track.name}
              </span>
              <p
                className="text-[12.5px] leading-[1.7] text-[#a8cef5] m-0"
                style={{ textWrap: "pretty" as never }}
              >
                {t(lang, track.desc.pl, track.desc.en)}
              </p>
              <div className="text-[10.5px] leading-[1.7] text-[#6d93c4] border-t border-[rgba(168,206,245,0.25)] pt-[9px] mt-auto">
                <span className="tracking-[0.16em]">JUDGED&nbsp;ON:</span>{" "}
                {track.judgedOn}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
