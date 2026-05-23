import { createBrowserClient } from "@supabase/ssr";

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

export function createClient() {
  const { url, key } = getConfig();
  return createBrowserClient(url, key);
}
