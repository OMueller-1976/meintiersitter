import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import Link from 'next/link';
import type { Bewerbung, Posting, Profile } from '@/types';

const LEISTUNG_LABEL: Record<string, string> = {
  gassi: 'Gassi gehen',
  fuettern: 'Füttern',
  tagesbetreuung: 'Tagesbetreuung',
  uebernachtung: 'Übernachtung',
};

const LEISTUNG_COLOR: Record<string, string> = {
  gassi: 'bg-blue-100 text-blue-700',
  fuettern: 'bg-amber-100 text-amber-700',
  tagesbetreuung: 'bg-purple-100 text-purple-700',
  uebernachtung: 'bg-green-100 text-green-700',
};

type BewerbungRow = Bewerbung & {
  posting: Posting & { tierhalter: Pick<Profile, 'full_name' | 'ort'> | null } | null;
};

type PostingRow = Posting & {
  tierhalter: Pick<Profile, 'full_name' | 'ort'> | null;
};

export default async function AnfragenPage() {
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

  // Eigene Bewerbungen (organisch von Pinnwand)
  const { data: bewerbungen } = await supabase
    .from('bewerbungen')
    .select(`
      *,
      posting:postings (
        *,
        tierhalter:profiles!tierhalter_id(full_name, ort)
      )
    `)
    .eq('sitter_id', user.id)
    .order('created_at', { ascending: false });

  const myBewerbungen = (bewerbungen ?? []) as BewerbungRow[];

  // Offene Postings in gleicher PLZ (neue regionale Gesuche)
  const { data: profile } = await supabase
    .from('profiles')
    .select('plz')
    .eq('id', user.id)
    .single();

  let regionalPostings: PostingRow[] = [];
  if (profile?.plz) {
    const { data: regional } = await supabase
      .from('postings')
      .select('*, tierhalter:profiles!tierhalter_id(full_name, ort)')
      .eq('status', 'offen')
      .eq('auf_pinnwand', true)
      .eq('plz', profile.plz)
      // Bereits beworben ausblenden
      .not(
        'id',
        'in',
        `(${myBewerbungen.map((b) => b.posting_id).join(',') || 'null'})`
      )
      .order('created_at', { ascending: false })
      .limit(5);
    regionalPostings = (regional ?? []) as PostingRow[];
  }

  const ausstehend = myBewerbungen.filter((b) => b.status === 'ausstehend');
  const ausgewaehlt = myBewerbungen.filter((b) => b.status === 'ausgewaehlt');
  const abgelehnt = myBewerbungen.filter((b) => b.status === 'abgelehnt');

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Anfragen & Bewerbungen</h1>
      <p className="text-gray-500 text-sm mb-8">Deine Bewerbungen und neue Gesuche in deiner Region</p>

      {/* Ausgewählte */}
      {ausgewaehlt.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Bestätigt 🎉
          </h2>
          <div className="space-y-3">
            {ausgewaehlt.map((b) => b.posting && (
              <PostingCard key={b.id} posting={b.posting} bewerbungStatus="ausgewaehlt" />
            ))}
          </div>
        </section>
      )}

      {/* Ausstehende */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Meine Bewerbungen ({ausstehend.length})
        </h2>
        {ausstehend.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
            <p className="text-gray-400 text-sm">
              Keine ausstehenden Bewerbungen.{' '}
              <Link href="/pinnwand" className="text-[#2D6A4F] hover:underline">
                Zur Pinnwand
              </Link>
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {ausstehend.map((b) => b.posting && (
              <PostingCard key={b.id} posting={b.posting} bewerbungStatus="ausstehend" />
            ))}
          </div>
        )}
      </section>

      {/* Regionale neue Gesuche */}
      {regionalPostings.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Neue Gesuche in deiner Region
            </h2>
            <Link href="/pinnwand" className="text-sm text-[#2D6A4F] hover:underline">
              Alle anzeigen →
            </Link>
          </div>
          <div className="space-y-3">
            {regionalPostings.map((posting) => (
              <PostingCard key={posting.id} posting={posting} isNew />
            ))}
          </div>
        </section>
      )}

      {/* Abgelehnte (zusammengeklappt) */}
      {abgelehnt.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Abgelehnt ({abgelehnt.length})
          </h2>
          <div className="space-y-2 opacity-60">
            {abgelehnt.map((b) => b.posting && (
              <PostingCard key={b.id} posting={b.posting} bewerbungStatus="abgelehnt" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function PostingCard({
  posting,
  bewerbungStatus,
  isNew,
}: {
  posting: PostingRow | (Posting & { tierhalter: Pick<Profile, 'full_name' | 'ort'> | null });
  bewerbungStatus?: 'ausstehend' | 'ausgewaehlt' | 'abgelehnt';
  isNew?: boolean;
}) {
  const statusBadge: Record<string, string> = {
    ausstehend: 'bg-yellow-50 text-yellow-700',
    ausgewaehlt: 'bg-green-50 text-green-700',
    abgelehnt: 'bg-red-50 text-red-500',
  };
  const statusLabel: Record<string, string> = {
    ausstehend: 'Ausstehend',
    ausgewaehlt: 'Ausgewählt ✓',
    abgelehnt: 'Abgelehnt',
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${LEISTUNG_COLOR[posting.leistung]}`}>
            {LEISTUNG_LABEL[posting.leistung]}
          </span>
          {isNew && (
            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-orange-50 text-orange-600">
              Neu
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600">
          {format(new Date(posting.datum_von), 'd. MMM yyyy', { locale: de })}
          {posting.datum_von !== posting.datum_bis && (
            <> – {format(new Date(posting.datum_bis), 'd. MMM yyyy', { locale: de })}</>
          )}
          {' · '}{posting.ort}
        </p>
        {'tierhalter' in posting && posting.tierhalter && (
          <p className="text-xs text-gray-400 mt-0.5">
            von {posting.tierhalter.full_name}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {bewerbungStatus && (
          <span className={`text-xs px-3 py-1.5 rounded-xl font-medium ${statusBadge[bewerbungStatus]}`}>
            {statusLabel[bewerbungStatus]}
          </span>
        )}
        {isNew && (
          <Link
            href="/pinnwand"
            className="text-xs bg-[#F4A261] text-white font-medium px-4 py-1.5 rounded-xl hover:bg-[#e08a44] transition-colors"
          >
            Bewerben
          </Link>
        )}
      </div>
    </div>
  );
}
