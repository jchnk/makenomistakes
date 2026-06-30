"use client";

import { useState, FormEvent } from "react";

type Status = "idle" | "submitting" | "success" | "duplicate" | "error";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return;

    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
      } else if (data.code === "duplicate") {
        setStatus("duplicate");
      } else {
        setStatus("error");
        setErrorMsg(data.error || "Coś poszło nie tak. Spróbuj ponownie.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Błąd sieci. Sprawdź połączenie i spróbuj ponownie.");
    }
  }

  if (status === "success" || status === "duplicate") {
    return (
      <div className="mt-9 rounded-[12px] bg-[#0e7a73] px-8 py-6 text-center text-white shadow-[0_14px_30px_rgba(14,122,115,0.3)]">
        <p className="font-sans text-lg font-bold">
          {status === "duplicate" ? "Już jesteś na liście ✓" : "✓ Jesteś na liście."}
        </p>
        <p className="mt-1 text-sm text-[#aeeede]">Dead center, first try.</p>
      </div>
    );
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mt-9 flex items-center gap-2.5 rounded-[14px] border border-[rgba(157,184,214,0.8)] bg-white py-2 pr-2 pl-5 shadow-[0_16px_36px_rgba(10,22,32,0.12)] max-sm:flex-col max-sm:p-4"
      >
        <input
          type="email"
          required
          placeholder="you@dev.io"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 border-none bg-transparent font-mono text-base text-[#0a2a3a] outline-none placeholder:text-[#9db8d6] max-sm:w-full max-sm:mb-2"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="cursor-pointer rounded-[9px] bg-[#cc1e8f] px-[26px] py-3.5 font-sans text-[15px] font-bold tracking-[0.01em] text-white transition-colors hover:bg-[#b01a7c] disabled:opacity-70 max-sm:w-full"
        >
          {status === "submitting" ? "Zapisuję…" : "Sign me up →"}
        </button>
      </form>
      {status === "error" && (
        <p className="mt-3 text-sm text-[#cc1e8f]">{errorMsg}</p>
      )}
    </>
  );
}
