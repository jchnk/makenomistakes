import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

const VALID_TRACKS = [
  "AI-Native Software",
  "Local & On-Device AI",
  "Physical AI & Robotics",
  "Model Training",
];

export async function POST(request: Request) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return Response.json(
        { error: "Zapis tymczasowo niedostępny — brak konfiguracji bazy." },
        { status: 503 }
      );
    }

    const { name, email, track } = await request.json();

    if (!name || typeof name !== "string" || !name.trim()) {
      return Response.json({ error: "Imię jest wymagane." }, { status: 400 });
    }

    if (!email || typeof email !== "string") {
      return Response.json({ error: "Email jest wymagany." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ error: "Nieprawidłowy email." }, { status: 400 });
    }

    if (!track || !VALID_TRACKS.includes(track)) {
      return Response.json({ error: "Nieprawidłowy track." }, { status: 400 });
    }

    const userAgent = request.headers.get("user-agent") || undefined;

    const { error } = await supabase.from("signups").insert({
      name: name.trim(),
      email: email.toLowerCase(),
      track,
      user_agent: userAgent,
    });

    if (error) {
      if (error.code === "23505") {
        return Response.json(
          { message: "Już jesteś na liście.", code: "duplicate" },
          { status: 409 }
        );
      }
      console.error("Supabase error:", error);
      return Response.json(
        { error: "Nie udało się zapisać. Spróbuj ponownie." },
        { status: 500 }
      );
    }

    return Response.json({ message: "Zapisano!" }, { status: 201 });
  } catch {
    return Response.json({ error: "Nieprawidłowe żądanie." }, { status: 400 });
  }
}
