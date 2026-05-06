import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import type { Bewertung, Match, Profile, TierProfile } from '@/types';
import StarRating from '@/components/ui/StarRating';
import BewertungenClient from './BewertungenClient';

type AusstehendRow = Match & {
  tierhalter: Pick<Profile, 'id' | 'full_name'> | null;
  sitter: Pick<Profile, 'id' | 'full_name'> | null;
  tier: Pick<TierProfile, 'name' | 'tierart'> | null;
};

type BewertungRow = Bewertung & {
  bewerter: Pick<Profile, 'full_name' | 'avatar_url' | 'ortschaft'> | null;
};

export default async function BewertungenPage() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Ausstehende Bewertungen: abgeschlossene Matches ohne eigene Bewertung
  const { data: ausstehendData } = await supabase
    .from('matches')
    .select(`
      *,
      tierhalter:profiles!tierhalter_id(id, full_name),
      sitter:profiles!sitter_id(id, full_name),
      tier:tier_profiles(name, tierart)
    `)
    .or(`tierhalter_id.eq.${user.id},sitter_id.eq.${user.id}`)
    .eq('status', 'abgeschlossen');

  // Eigene Bewertungen laden um bereits bewertete Matches auszufiltern
  const { data: eigeneBewertungen } = await supabase
    .from('bewertungen')
    .select('match_id')
    .eq('bewerter_id', user.id);

  const bewerteteMatchIds = new Set((eigeneBewertungen ?? []).map((b) => b.match_id));
  const ausstehend = ((ausstehendData ?? []) as AusstehendRow[]).filter(
    (m) => !bewerteteMatchIds.has(m.id)
  );

  // Erhaltene Bewertungen
  const { data: erhalten } = await supabase
    .from('bewertungen')
    .select('*, bewerter:profiles!bewerter_id(full_name, avatar_url, ortschaft)')
    .eq('bewertet_id', user.id)
    .order('created_at', { ascending: false });

  const bewertungen = (erhalten ?? []) as BewertungRow[];
  const avg = bewertungen.length
    ? bewertungen.reduce((sum, b) => sum + b.sterne, 0) / bewertungen.length
    : 0;

  const gegenueberOf = (m: AusstehendRow) =>
    user.id === m.tierhalter_id ? m.sitter : m.tierhalter;

  return (
    <div className="p-6 md:p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Bewertungen</h1>

      {/* ── Ausstehende Bewertungen ────────────────────────── */}
      <section className="mb-10">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Ausstehende Bewertungen
        </h2>
        {ausstehend.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
            <p className="text-green-600 font-medium">Alle Bewertungen erledigt ✓</p>
          </div>
        ) : (
          <div className="space-y-3">
            {ausstehend.map((m) => {
              const gegenueber = gegenueberOf(m);
              return (
                <div
                  key={m.id}
                  className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {m.tier?.name ?? 'Tier'} · {m.leistung}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {format(new Date(m.datum_von), 'd. MMM yyyy', { locale: de })}
                      {' mit '}
                      {gegenueber?.full_name ?? 'Unbekannt'}
                    </p>
                  </div>
                  {gegenueber && (
                    <BewertungenClient
                      matchId={m.id}
                      bewertetId={gegenueber.id}
                      bewertetName={gegenueber.full_name ?? 'Unbekannt'}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Erhaltene Bewertungen ──────────────────────────── */}
      <section>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Erhaltene Bewertungen
        </h2>

        {bewertungen.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
            <p className="text-gray-500 mb-1">Noch keine Bewertungen erhalten.</p>
            <p className="text-xs text-gray-400">
              Nach abgeschlossenen Matches können beide Seiten sich gegenseitig bewerten.
            </p>
          </div>
        ) : (
          <>
            {/* Durchschnitt */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4 flex items-center gap-4">
              <div className="text-4xl font-bold text-gray-900">{avg.toFixed(1)}</div>
              <div>
                <StarRating readonly rating={avg} size="md" />
                <p className="text-xs text-gray-400 mt-1">
                  Basierend auf {bewertungen.length} Bewertung{bewertungen.length !== 1 ? 'en' : ''}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {bewertungen.map((b) => {
                const initials = b.bewerter?.full_name
                  ? b.bewerter.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
                  : '?';
                return (
                  <div key={b.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="w-9 h-9 rounded-full bg-[#F0FDF4] text-[#2D6A4F] font-bold flex items-center justify-center text-xs flex-shrink-0">
                        {initials}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-gray-900">
                            {b.bewerter?.full_name ?? 'Anonym'}
                          </p>
                          <span className="text-xs text-gray-400">
                            {format(new Date(b.created_at), 'd. MMM yyyy', { locale: de })}
                          </span>
                        </div>
                        {b.bewerter?.ortschaft && (
                          <p className="text-xs text-gray-400">{b.bewerter.ortschaft}</p>
                        )}
                      </div>
                    </div>
                    <StarRating readonly rating={b.sterne} size="sm" />
                    {b.kommentar && (
                      <p className="text-sm text-gray-600 mt-2">{b.kommentar}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
