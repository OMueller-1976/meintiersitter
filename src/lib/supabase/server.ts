import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function getConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "[Supabase] Fehlende Umgebungsvariablen:\n" +
        (!url ? "  • NEXT_PUBLIC_SUPABASE_URL ist nicht gesetzt\n" : "") +
        (!key ? "  • NEXT_PUBLIC_SUPABASE_ANON_KEY ist nicht gesetzt\n" : "") +
        "Bitte .env.local prüfen."
    );
  }

  return { url, key };
}

export async function createClient() {
  const { url, key } = getConfig();
  const cookieStore = await cookies();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // setAll called from a Server Component — cookies can be set in middleware
        }
      },
    },
  });
}
