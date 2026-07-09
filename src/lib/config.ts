// ============================================================
// Make No Mistakes — Editable configuration
// All [TBA] placeholders and event constants live here.
// Update these values as information becomes available.
// ============================================================

export const EVENT_CONFIG = {
  // Core dates
  eventStartISO: "2026-09-04T09:00:00", // Europe/Warsaw
  eventEndDate: "September 10, 2026",

  // Ticket
  ticketNo: "000426",

  // Spots
  spotsTaken: 87,
  spotsTotal: 200,

  // Prizes — update when confirmed
  prizesPerTrack: "[TBA]",
  prizePool: "[TBA]",

  // Schedule hours
  scheduleHours: "[TBA]",

  // Contact info
  contactEmail: "[TBA]",
  contactTelegram: "[TBA]",
  contactX: "[TBA]",

  // Sponsor partnership link
  partnershipUrl: "mailto:paulina@ethwarsaw.dev",
  partnerContentUrl: "mailto:paulina@ethwarsaw.dev",

  // Registration
  lumaRegistration: "[TBA]",

  // Share URL
  shareUrl: "https://prelint.com/hackathon",
} as const;

// Jury / mentors — update as confirmed
export const JURY_COMPANIES = [
  "Vercel",
  "Anthropic",
  "ElevenLabs",
  "Prelint",
  "VC",
  "[TBA]",
] as const;

// Jury member details — all TBA for now
export const JURY_MEMBERS = JURY_COMPANIES.map((company) => ({
  name: "[TBA]" as string,
  role: "[TBA]" as string,
  company,
}));

// Tracks
export const TRACKS = [
  "AI-Native Software",
  "Local & On-Device AI",
  "Physical AI & Robotics",
  "Model Training",
] as const;

export type Track = (typeof TRACKS)[number];
