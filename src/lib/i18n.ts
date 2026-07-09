"use client";

import { createContext, useContext } from "react";

export type Lang = "pl" | "en";

export const LangContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
}>({ lang: "pl", setLang: () => {} });

export function useLang() {
  return useContext(LangContext);
}

// Helper: pick the right string based on current language
export function t(lang: Lang, pl: string, en: string): string {
  return lang === "pl" ? pl : en;
}

// ============================================================
// All translatable strings extracted from the design reference.
// Organized by section.
// ============================================================

export const strings = {
  // --- Hero / Ticket ---
  hero: {
    metaLeft: "WARSAW · Politechnika Warszawska + Kolektyw3 · SEP 4–10, 2026",
    metaRight: "ORGANIZED BY KOLEKTYW3 × PRELINT",
    aiHackathon: "AI HACKATHON",
    coordinates: "N 52°14′ · E 21°01′",
    syrenkaCaption: "Syrenka · bronze · 1939",
    countdownLabel: { pl: "do startu:", en: "t-minus:" },
    admitOne: "ADMIT ONE",
    ticketNoLabel: "TICKET NO.",
    title: "MAKE NO MISTAKES",
    tagline: {
      pl: "Tygodniowy hackathon AI w Warszawie.\nBuduj, trenuj, wdrażaj.",
      en: "A week-long AI hackathon in Warsaw.\nBuild, train, ship.",
    },
    whenLabel: "KIEDY",
    whenValue: { pl: "4–10 września 2026", en: "September 4–10, 2026" },
    whereLabel: "GDZIE",
    whereValue: "Politechnika Warszawska + Kolektyw3",
    whyLabel: "DLACZEGO",
    whyValueSuffix: { pl: "per track", en: "per track" },
    spotsLabel: { pl: "MIEJSC ZAJĘTYCH", en: "SPOTS TAKEN" },
    formNamePlaceholder: { pl: "Imię", en: "Name" },
    formSubmit: { pl: "Zapisz →", en: "Join →" },
    formNote: {
      pl: "Zbierz zespół 3–4 os., pełne zespoły mają gwarantowane miejsca.",
      en: "Bring a team of 3–4, full teams get guaranteed spots.",
    },
    lumaButton: {
      pl: "Dokończ rejestrację na Luma →",
      en: "Complete registration on Luma →",
    },
    avatarButton: {
      pl: "Stwórz swój awatar hackathonowy →",
      en: "Create your hackathon avatar →",
    },
    successHeading: {
      pl: "Prawie gotowe.",
      en: "Almost there.",
    },
    successNote: {
      pl: "Dokończ rejestrację na Luma, żeby potwierdzić miejsce.",
      en: "Complete your registration on Luma to confirm your spot.",
    },
    shareHeading: "I’M HACKING AT",
    shareTitle: "Make No Mistakes · Warsaw",
    shareXButton: { pl: "Udostępnij na X", en: "Share on X" },
    shareLinkedIn: "LinkedIn",
    shareConfirmation: {
      pl: "✓ Zapisano. Dokończ rejestrację na Luma, żeby potwierdzić miejsce.",
      en: "✓ Signed up. Complete your Luma registration to confirm your spot.",
    },
    duplicateConfirmation: {
      pl: "Już jesteś na liście ✓ Dokończ rejestrację na Luma.",
      en: "You’re already on the list ✓ Complete your Luma registration.",
    },
  },

  // --- Nav ---
  nav: {
    logo: "MAKE NO MISTAKES",
    links: ["TRACKS", "AGENDA", "JURY", "SPONSORS", "FAQ"],
    cta: { pl: "Zarejestruj się →", en: "Register →" },
  },

  // --- About ---
  about: {
    sectionLabel: { pl: "01 / O EVENCIE", en: "01 / ABOUT" },
    heading: {
      pl: "Spokojnie. Zdążysz. Masz na hackowanie całe 6 dni.",
      en: "Relax. You’ll make it. You get six full days to hack.",
    },
    description: {
      pl: "Make No Mistakes daje Ci sześć dni na zbudowanie czegoś dobrego: modelu, agenta, robota. To hackathon, który wychodzi poza szybki vibecoding: pracuj nad ulepszeniem AI, buduj pełne produkty (nie pojedyncze funkcje), spróbuj sił w czymś bardziej czasochłonnym, jak trenowanie własnego modelu. Solo albo w zespole do 4 osób, z mentorami z Vercela, Anthropic i ElevenLabs i przestrzenią Kolektyw3 otwartą 24/7. Za darmo.",
      en: "Make No Mistakes gives you six days to build something that actually works: a model, an agent, a robot. This hackathon goes beyond quick vibecoding: work on improving AI itself, build full products instead of single features, and take on something more time-consuming, like training your own model. Solo or in a team of up to 4, with mentors from Vercel, Anthropic, and ElevenLabs and the Kolektyw3 space open 24/7. Free to join.",
    },
    stats: [
      { value: "6", label: { pl: "DNI HACKOWANIA", en: "DAYS OF HACKING" } },
      { value: "200+", label: { pl: "UCZESTNIKÓW", en: "HACKERS" } },
      { value: "0 zł", label: { pl: "DARMOWY UDZIAŁ", en: "FREE TO JOIN" } },
      { value: "1–4", label: { pl: "OSOBY W ZESPOLE", en: "TEAM SIZE" } },
    ],
  },

  // --- Tracks ---
  tracks: {
    sectionLabel: { pl: "02 / TRACKI", en: "02 / TRACKS" },
    heading: {
      pl: "Cztery kategorie.",
      en: "Four tracks.",
    },
    prizesNote: { pl: "NAGRODY: [TBA] PER TRACK", en: "PRIZES: [TBA] PER TRACK" },
    items: [
      {
        num: "01",
        name: "AI-Native Software & Self-Improving Agents",
        desc: {
          pl: "Agenci, którzy przejmują cały workflow, i systemy, które same się ulepszają. MCP jako domyślna infrastruktura.",
          en: "Agents that own an entire workflow, and systems that improve themselves. MCP as default plumbing.",
        },
        judgedOn: "success rate across ≥50 runs · real task completion · production-shaped architecture",
      },
      {
        num: "02",
        name: "Local & On-Device AI",
        desc: {
          pl: "AI, które działa tam, gdzie jest użytkownik: laptop, telefon, Raspberry Pi. Offline, prywatnie, zero kosztu per token.",
          en: "AI that runs where the user is: laptop, phone, Raspberry Pi. Offline, private, zero cost per token.",
        },
        judgedOn: "runs locally end-to-end · evals vs. cloud · latency & footprint · privacy",
      },
      {
        num: "03",
        name: "Physical AI & Robotics",
        desc: {
          pl: "AI spotyka atomy. Steruj ramieniem robota językiem naturalnym, pokaż transfer z symulacji do rzeczywistości. Sprzęt niewymagany.",
          en: "AI meets atoms. Drive a robot arm with natural language, show sim-to-real transfer. No hardware required.",
        },
        judgedOn: "live physical demo (sim: video) · survives a second run · model output → physical action",
      },
      {
        num: "04",
        name: "Model Training: Fine-tuning & Distillation",
        desc: {
          pl: "Naucz model czegoś, czego nie umiał: niech GLM (albo coś mniejszego) analizuje DNA albo czyta orzeczenia sądowe. Mały i wyspecjalizowany bije duży i ogólny.",
          en: "Teach a model something it couldn’t do: make GLM (or something smaller) analyze DNA or read court rulings. Small and specialized beats big and generic.",
        },
        judgedOn: "eval-proven capability gain vs. base model · data work · size/cost efficiency · reproducible recipe",
      },
    ],
  },

  // --- Agenda ---
  agenda: {
    sectionLabel: "03 / AGENDA",
    heading: {
      pl: "6 dni hackowania i warsztatów.",
      en: "6 days of hacking and workshops.",
    },
    hybridNote: {
      pl: "Format hybrydowy: hackuj onsite w Kolektyw3 lub zdalnie.",
      en: "Hybrid format: hack onsite at Kolektyw3 or remotely.",
    },
    rows: [
      {
        date: { pl: "Pt 4.09", en: "Fri, Sep 4" },
        desc: {
          pl: "Otwarcie · team building · start hackowania",
          en: "Opening ceremony · team building · hacking begins",
        },
        venue: "POLITECHNIKA WARSZAWSKA",
      },
      {
        date: { pl: "Sb–Nd 5–6.09", en: "Sat–Sun, Sep 5–6" },
        desc: {
          pl: "Hackowanie 24/7",
          en: "Hacking 24/7",
        },
        venue: "KOLEKTYW3 (24/7)",
      },
      {
        date: { pl: "Pn 7.09", en: "Mon, Sep 7" },
        desc: {
          pl: "Hackowanie + Track Workshop with Guest Speaker",
          en: "Hacking + Track Workshop with Guest Speaker",
        },
        venue: "KOLEKTYW3",
      },
      {
        date: { pl: "Wt 8.09", en: "Tue, Sep 8" },
        desc: {
          pl: "Hackowanie + Track Workshop with Guest Speaker",
          en: "Hacking + Track Workshop with Guest Speaker",
        },
        venue: "KOLEKTYW3",
      },
      {
        date: { pl: "Śr 9.09", en: "Wed, Sep 9" },
        desc: {
          pl: "Hackowanie + Track Workshop with Guest Speaker",
          en: "Hacking + Track Workshop with Guest Speaker",
        },
        venue: "KOLEKTYW3",
      },
      {
        date: { pl: "Cz 10.09", en: "Thu, Sep 10" },
        desc: {
          pl: "Demo Day: prezentacje, wyniki, zamknięcie",
          en: "Demo Day: final pitches, results, closing",
        },
        venue: "POLITECHNIKA WARSZAWSKA",
      },
    ],
    hoursNote: { pl: "GODZINY: [TBA]", en: "HOURS: [TBA]" },
    workshopNote: {
      pl: "Warsztaty częściowo otwarte dla nie-hackerów, limitowane miejsca.",
      en: "Workshops partially open to non-hackers, limited spots.",
    },
    workshopCta: {
      pl: "Zapisz się na warsztaty →",
      en: "Join the workshops →",
    },
  },

  // --- Jury ---
  jury: {
    sectionLabel: { pl: "04 / JURY I MENTORZY", en: "04 / JUDGES & MENTORS" },
    heading: {
      pl: "Eksperci z firm, które budują AI.",
      en: "Experts from the companies building AI.",
    },
    companies: "VERCEL · PRELINT · ANTHROPIC · ELEVENLABS · VC",
  },

  // --- Sponsors ---
  sponsors: {
    sectionLabel: { pl: "05 / SPONSORZY", en: "05 / SPONSORS & PARTNERS" },
    goldLabel: "GOLD · MAIN PARTNER",
    goldName: "Vercel",
    organizersLabel: { pl: "ORGANIZATORZY", en: "ORGANIZERS" },
    silverLabel: "SILVER",
    bronzeLabel: "BRONZE",
    becomeHeading: {
      pl: "Zostań sponsorem lub partnerem.",
      en: "Become a sponsor or partner.",
    },
    becomeDescription: {
      pl: "Hackathon trwa tydzień. Sponsorzy mogą poprowadzić warsztat, wystawić bounty w swoim tracku i mieć dostęp do uczestników. Rozliczenie milestone’owe. Tiery: Gold / Silver / Bronze + partnerstwa per track.",
      en: "The hackathon runs for a full week. Sponsors can host a workshop, set a bounty in their track, and connect with participants. Milestone-based billing. Tiers: Gold / Silver / Bronze + per-track partnerships.",
    },
    becomePartnerNote: {
      pl: "Chcesz być partnerem contentowym / community?",
      en: "Want to be a content or community partner?",
    },
    becomePartnerLink: { pl: "Napisz.", en: "Reach out." },
    becomeCta: {
      pl: "Porozmawiajmy o partnerstwie →",
      en: "Let’s talk partnership →",
    },
    academicLabel: {
      pl: "PARTNERZY AKADEMICCY",
      en: "ACADEMIC PARTNERS",
    },
    communityLabel: {
      pl: "PARTNERZY SPOŁECZNI",
      en: "COMMUNITY PARTNERS",
    },
  },

  // --- Rules + FAQ ---
  rulesFaq: {
    sectionLabel: { pl: "06 / ZASADY + FAQ", en: "06 / RULES + FAQ" },
    heading: { pl: "Proste zasady.", en: "Simple rules." },
    rules: [
      { pl: "Zespoły 1–4 osoby", en: "Teams of 1–4" },
      {
        pl: "Ocena: innowacyjność · wykonanie techniczne · użyteczność · jakość demo",
        en: "Judging: innovation · technical execution · usefulness · demo quality",
      },
      { pl: "Udział darmowy", en: "Free to participate" },
    ],
    faq: {
      pl: [
        { q: "Czy udział jest płatny?", a: "Nie, hackathon jest darmowy." },
        { q: "Kto może wziąć udział?", a: "Każdy, kto buduje z AI: devs, founderzy, model trainerzy, indie hackerzy." },
        { q: "Czy trzeba być na miejscu?", a: "Nie, hackathon jest hybrydowy. Możesz hackować zdalnie lub onsite w Kolektyw3." },
        { q: "Gdzie hackuję w trakcie tygodnia?", a: "Kolektyw3 jest otwarte dla hackerów 24/7 przez cały tydzień." },
        { q: "Czy będzie jedzenie?", a: "Tak." },
        { q: "Czy mogę przyjść bez zespołu?", a: "Tak, team building jest częścią otwarcia." },
        { q: "Czy kod musi powstać w trakcie hackathonu?", a: "[TBA]" },
        { q: "Nagrody?", a: "Per track, pula [TBA] + kredyty od sponsorów." },
      ],
      en: [
        { q: "Is it free?", a: "Yes, the hackathon is free." },
        { q: "Who can join?", a: "Anyone building with AI: devs, founders, model trainers, indie hackers." },
        { q: "Do I need to be onsite?", a: "No, the hackathon is hybrid. You can hack remotely or onsite at Kolektyw3." },
        { q: "Where do I hack during the week?", a: "Kolektyw3 is open to hackers 24/7 all week." },
        { q: "Food?", a: "Yes." },
        { q: "Can I come solo?", a: "Yes, team building is part of the opening." },
        { q: "Does the code have to be written during the hackathon?", a: "[TBA]" },
        { q: "Prizes?", a: "Per track, pool [TBA] + sponsor credits." },
      ],
    },
  },

  // --- Footer ---
  footer: {
    organized: "ORGANIZED BY KOLEKTYW3 × PRELINT · MAIN PARTNER: VERCEL",
  },
} as const;
