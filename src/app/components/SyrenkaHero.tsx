"use client";

import { useState, useEffect, useCallback, FormEvent } from "react";
import { useLang, t, strings } from "@/lib/i18n";
import { EVENT_CONFIG, TRACKS } from "@/lib/config";

type Status = "idle" | "submitting" | "success" | "duplicate" | "error";

export default function SyrenkaHero() {
  const { lang } = useLang();
  const s = strings.hero;

  // Countdown
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const target = new Date(EVENT_CONFIG.eventStartISO).getTime();
  let diff = Math.max(0, target - now) / 1000;
  const days = Math.floor(diff / 86400);
  diff -= days * 86400;
  const hours = Math.floor(diff / 3600);
  diff -= hours * 3600;
  const mins = Math.floor(diff / 60);
  const secs = Math.floor(diff - mins * 60);
  const pad = (n: number) => String(n).padStart(2, "0");
  const countdown = `${days}d ${pad(hours)}:${pad(mins)}:${pad(secs)}`;

  // Wide breakpoint
  const [wide, setWide] = useState(true);
  useEffect(() => {
    const check = () => setWide(window.innerWidth >= 1150);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [track, setTrack] = useState<string>(TRACKS[0]);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      const trimmedEmail = email.trim();
      const trimmedName = name.trim();
      if (!trimmedEmail || !trimmedName) return;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) return;

      setStatus("submitting");
      setErrorMsg("");

      try {
        const res = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: trimmedName,
            email: trimmedEmail,
            track,
          }),
        });
        const data = await res.json();

        if (res.ok) {
          setStatus("success");
        } else if (data.code === "duplicate") {
          setStatus("duplicate");
        } else {
          setStatus("error");
          setErrorMsg(data.error || "Something went wrong.");
        }
      } catch {
        setStatus("error");
        setErrorMsg(
          lang === "pl"
            ? "Błąd sieci. Sprawdź połączenie."
            : "Network error. Check your connection."
        );
      }
    },
    [email, name, track, lang]
  );

  // Spots
  const { spotsTaken, spotsTotal } = EVENT_CONFIG;
  const spotsPct = Math.min(100, Math.round((spotsTaken / spotsTotal) * 100));

  // Share
  const shareName = name.trim() || (lang === "pl" ? "Ja" : "Me");
  const shareText = encodeURIComponent(
    `I'm hacking at Make No Mistakes · Warsaw · Sep 4–10 — track: ${track}`
  );
  const shareUrl = encodeURIComponent(EVENT_CONFIG.shareUrl);

  const submitted = status === "success" || status === "duplicate";

  const lumaUrl = (() => {
    const base = "https://luma.com/make-no-mistakes";
    const params = new URLSearchParams();
    const trimmedEmail = email.trim();
    const trimmedName = name.trim();
    if (trimmedEmail) params.set("email", trimmedEmail);
    if (trimmedName) params.set("name", trimmedName);
    const qs = params.toString();
    return qs ? `${base}?${qs}` : base;
  })();

  // Load generative-art.js
  useEffect(() => {
    if (typeof window !== "undefined" && !customElements.get("mnm-syrenka-lens")) {
      const script = document.createElement("script");
      script.src = "/generative-art.js";
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <header
      id="top"
      className="px-6 pt-12 pb-7 flex justify-center md:px-12"
    >
      <div className="w-full max-w-[1240px]">
        {/* Outer dark frame with clipped corners */}
        <div
          className="bg-[#0a1b33] p-6 box-border"
          style={{
            clipPath:
              "polygon(22px 0, calc(100% - 22px) 0, 100% 22px, 100% calc(100% - 22px), calc(100% - 22px) 100%, 22px 100%, 0 calc(100% - 22px), 0 22px)",
          }}
        >
          {/* Meta bar */}
          <div className="flex justify-between items-center px-1.5 pt-4 text-[11.5px] tracking-[0.2em] text-[#a8cef5]">
            <span>{s.metaLeft}</span>
            <span className="hidden sm:inline">{s.metaRight}</span>
          </div>

          {/* Inner ticket */}
          <div
            className="relative flex flex-col lg:flex-row overflow-hidden lg:h-[660px]"
            style={{
              clipPath:
                "polygon(14px 0, calc(100% - 14px) 0, 100% 14px, 100% calc(100% - 14px), calc(100% - 14px) 100%, 14px 100%, 0 calc(100% - 14px), 0 14px)",
            }}
          >
            {/* Left — Syrenka canvas */}
            <div className="flex-1 min-w-0 bg-[#2e7fd9] relative flex min-h-[300px] lg:min-h-0">
              {/* @ts-expect-error - custom web component */}
              <mnm-syrenka-lens
                palette="sky"
                zoom="1.14"
                y-align="0"
                style={{ flex: 1, minHeight: 0 }}
              />
              {/* Corner labels */}
              <div className="absolute top-[22px] left-7 flex items-center gap-2.5 text-[#edf3fb]">
                <span className="text-[12px] tracking-[0.26em]">
                  AI&nbsp;HACKATHON
                </span>
              </div>
              {wide && (
                <>
                  <div className="absolute top-[26px] right-7 text-[12px] tracking-[0.14em] text-[#a8cef5]">
                    {s.coordinates}
                  </div>
                  <div className="absolute bottom-6 right-7 text-[12px] tracking-[0.14em] text-[#a8cef5]">
                    {s.syrenkaCaption}
                  </div>
                </>
              )}
              <div className="absolute bottom-6 left-7 text-[12px] tracking-[0.14em] text-[#a8cef5]">
                {t(lang, s.countdownLabel.pl, s.countdownLabel.en)}&nbsp;
                {countdown}
              </div>
            </div>

            {/* Perforation notches — hidden on mobile */}
            <div
              className="hidden lg:block absolute z-[2] bg-[#0a1b33]"
              style={{
                right: 452,
                top: 0,
                width: 36,
                height: 20,
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              }}
            />
            <div
              className="hidden lg:block absolute z-[2] bg-[#0a1b33]"
              style={{
                right: 452,
                bottom: 0,
                width: 36,
                height: 20,
                clipPath: "polygon(0 100%, 100% 100%, 50% 0)",
              }}
            />

            {/* Right stub — signup */}
            <div
              id="signup"
              className="flex-none w-full lg:w-[470px] bg-[#edf3fb] text-[#1b549e] lg:border-l-2 lg:border-dashed lg:border-[rgba(10,27,51,0.5)] box-border px-6 py-7 lg:px-[34px] lg:pt-7 lg:pb-6 flex flex-col"
            >
              {/* ADMIT ONE / TICKET NO */}
              <div className="flex justify-between text-[11px] tracking-[0.24em] font-medium">
                <span>{s.admitOne}</span>
                <span>
                  {s.ticketNoLabel}&nbsp;{EVENT_CONFIG.ticketNo}
                </span>
              </div>

              {/* Title */}
              <div className="font-serif text-[42px] lg:text-[62px] leading-[0.94] tracking-[-0.02em] mt-5 mb-4 text-[#0a1b33]">
                {s.title}
              </div>

              {/* Tagline */}
              <div className="text-[13px] leading-[1.65] border-t border-[rgba(27,84,158,0.4)] pt-3">
                {t(lang, s.tagline.pl, s.tagline.en)
                  .split("\n")
                  .map((line, i) => (
                    <span key={i}>
                      {line}
                      {i === 0 && <br />}
                    </span>
                  ))}
              </div>

              {/* KIEDY / GDZIE / DLACZEGO */}
              <div className="mt-3.5 flex flex-col">
                <div className="flex justify-between items-baseline border-t border-[rgba(27,84,158,0.3)] py-[7px]">
                  <span className="text-[10px] tracking-[0.22em]">
                    {s.whenLabel}
                  </span>
                  <span className="text-[14px] font-bold">
                    {t(lang, s.whenValue.pl, s.whenValue.en)}
                  </span>
                </div>
                <div className="flex justify-between items-baseline border-t border-[rgba(27,84,158,0.3)] py-[7px]">
                  <span className="text-[10px] tracking-[0.22em]">
                    {s.whereLabel}
                  </span>
                  <span className="text-[14px] font-bold text-right">
                    {s.whereValue}
                  </span>
                </div>
                <div className="flex justify-between items-baseline border-t border-b border-[rgba(27,84,158,0.3)] py-[7px]">
                  <span className="text-[10px] tracking-[0.22em]">
                    {s.whyLabel}
                  </span>
                  <span className="text-[14px] font-bold">
                    {EVENT_CONFIG.prizesPerTrack} ·{" "}
                    <span className="font-normal text-[12px]">
                      {t(lang, s.whyValueSuffix.pl, s.whyValueSuffix.en)}
                    </span>
                  </span>
                </div>
              </div>

              {/* Spots counter */}
              <div className="mt-3.5 flex flex-col gap-1.5">
                <div className="flex justify-between text-[11px] tracking-[0.16em] text-[#2e7fd9]">
                  <span>
                    <span style={{ animation: "mnm-pulse 1.6s ease-in-out infinite" }}>
                      ●
                    </span>
                    &nbsp;{t(lang, s.spotsLabel.pl, s.spotsLabel.en)}
                  </span>
                  <span className="font-bold">
                    {spotsTaken}/{spotsTotal}
                  </span>
                </div>
                <div className="h-2 border-[1.5px] border-[#0a1b33] bg-white">
                  <div
                    className="h-full bg-[#2e7fd9]"
                    style={{ width: `${spotsPct}%` }}
                  />
                </div>
              </div>

              <div className="flex-1" />

              {/* Form or Share card */}
              {!submitted ? (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-2 mt-3.5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder={t(
                        lang,
                        s.formNamePlaceholder.pl,
                        s.formNamePlaceholder.en
                      )}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="border-2 border-[#0a1b33] outline-none bg-white font-mono text-[13.5px] text-[#0a1b33] px-[13px] py-3 min-w-0"
                    />
                    <select
                      value={track}
                      onChange={(e) => setTrack(e.target.value)}
                      className="border-2 border-[#0a1b33] outline-none bg-white font-mono text-[12.5px] text-[#0a1b33] px-[9px] py-3 min-w-0"
                    >
                      {TRACKS.map((tr) => (
                        <option key={tr} value={tr}>
                          {tr}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex border-2 border-[#0a1b33] bg-white">
                    <input
                      type="email"
                      required
                      placeholder="you@dev.io"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 min-w-0 border-none outline-none bg-transparent font-mono text-[13.5px] text-[#0a1b33] px-[13px] py-[13px]"
                    />
                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="border-none cursor-pointer font-sans font-bold text-[14px] text-[#edf4fc] bg-[#2e7fd9] px-5 whitespace-nowrap hover:bg-[#1b549e] disabled:opacity-70"
                    >
                      {status === "submitting"
                        ? "..."
                        : t(lang, s.formSubmit.pl, s.formSubmit.en)}
                    </button>
                  </div>
                  {status === "error" && (
                    <div className="text-[10.5px] text-red-600">{errorMsg}</div>
                  )}
                  <div className="text-[10.5px] leading-[1.6] text-[#4a6c96]">
                    {t(lang, s.formNote.pl, s.formNote.en)}
                  </div>
                </form>
              ) : (
                <div className="mt-3.5 flex flex-col gap-2">
                  {/* Share card */}
                  <div className="border-2 border-[#2e7fd9] bg-[#0a1b33] text-[#edf3fb] px-4 py-3.5 flex flex-col gap-1">
                    <span className="text-[9.5px] tracking-[0.22em] text-[#a8cef5]">
                      {s.shareHeading}
                    </span>
                    <span className="font-serif text-[21px]">
                      {s.shareTitle}
                    </span>
                    <span className="text-[11.5px] text-[#a8cef5]">
                      {shareName} · {track} · Sep 4–10
                    </span>
                  </div>
                  {/* Share buttons */}
                  <div className="flex gap-2">
                    <a
                      href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center font-sans font-bold text-[13px] text-[#edf4fc] bg-[#0a1b33] no-underline py-[11px] hover:bg-[#1b549e]"
                    >
                      {t(lang, s.shareXButton.pl, s.shareXButton.en)}
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center font-sans font-bold text-[13px] text-[#0a1b33] bg-white border-2 border-[#0a1b33] box-border no-underline py-[9px] hover:bg-[#a8cef5]"
                    >
                      {s.shareLinkedIn}
                    </a>
                  </div>
                  <a
                    href={lumaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center font-sans font-bold text-[14px] text-[#edf4fc] bg-[#2e7fd9] no-underline py-[11px] hover:bg-[#1b549e]"
                  >
                    {t(lang, s.lumaButton.pl, s.lumaButton.en)}
                  </a>
                  <div className="text-[10.5px] text-[#4a6c96]">
                    {status === "duplicate"
                      ? t(
                          lang,
                          s.duplicateConfirmation.pl,
                          s.duplicateConfirmation.en
                        )
                      : t(
                          lang,
                          s.shareConfirmation.pl,
                          s.shareConfirmation.en
                        )}
                  </div>
                </div>
              )}

              {/* Barcode stripe */}
              <div
                className="mt-3.5 h-10"
                style={{
                  background:
                    "repeating-linear-gradient(90deg, #1b549e 0 2px, transparent 2px 4px, #1b549e 4px 7px, transparent 7px 12px, #1b549e 12px 14px, transparent 14px 17px, #1b549e 17px 18px, transparent 18px 23px)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
