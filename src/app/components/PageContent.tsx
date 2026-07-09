"use client";

import { useLang } from "@/lib/i18n";
import SyrenkaHero from "./SyrenkaHero";
import StickyNav from "./StickyNav";
import AboutSection from "./AboutSection";
import TracksSection from "./TracksSection";
import AgendaSection from "./AgendaSection";
import JurySection from "./JurySection";
import SponsorsSection from "./SponsorsSection";
import RulesFaqSection from "./RulesFaqSection";
import Footer from "./Footer";

export default function PageContent() {
  const { lang } = useLang();

  return (
    <div className="font-mono text-[#0a1b33] bg-[#edf4fc] min-h-screen flex flex-col">
      <SyrenkaHero />
      <StickyNav />
      <AboutSection lang={lang} />
      <TracksSection lang={lang} />
      <AgendaSection lang={lang} />
      <JurySection lang={lang} />
      <SponsorsSection lang={lang} />
      <RulesFaqSection />
      <Footer />
    </div>
  );
}
