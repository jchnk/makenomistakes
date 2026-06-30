import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return Response.json(
        { error: "Zapis tymczasowo niedostępny — brak konfiguracji bazy." },
        { status: 503 }
      );
    }

    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return Response.json({ error: "Email jest wymagany." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ error: "Nieprawidłowy email." }, { status: 400 });
    }

    const userAgent = request.headers.get("user-agent") || undefined;

    const { error } = await supabase
      .from("signups")
      .insert({ email: email.toLowerCase(), user_agent: userAgent });

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
