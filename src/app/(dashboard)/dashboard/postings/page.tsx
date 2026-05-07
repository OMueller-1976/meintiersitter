import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import Link from 'next/link';
import type { Posting, Bewerbung, Profile, PostingStatus } from '@/types';
import { deletePostingAction, respondToBewerbungAction } from './actions';

const LEISTUNG_LABEL: Record<string, string> = {
  gassi: 'Gassi gehen',
  fuettern: 'Füttern',
  tagesbetreuung: 'Tagesbetreuung',
  uebernachtung: 'Übernachtung',
};

const STATUS_CONFIG: Record<PostingStatus, { label: string; color: string }> = {
  offen: { label: 'Offen', color: 'bg-[#DDEAF4] text-[#2E4A6B]' },
  besetzt: { label: 'Besetzt', color: 'bg-blue-100 text-blue-700' },
  abgeschlossen: { label: 'Abgeschlossen', color: 'bg-gray-100 text-gray-600' },
  abgebrochen: { label: 'Abgebrochen', color: 'bg-red-100 text-red-700' },
};

type BewerbungRow = Bewerbung & { sitter: Pick<Profile, 'full_name' | 'ort' | 'avatar_url'> | null };
type PostingRow = Posting & { bewerbungen: BewerbungRow[] };

export default async function PostingsPage({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const cookieStore = await cookies();
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

  const tab = (searchParams.tab ?? 'offen') as PostingStatus;

  const { data: postings } = await supabase
    .from('postings')
    .select(`
      *,
      bewerbungen (
        *,
        sitter:profiles!sitter_id(full_name, ort, avatar_url)
      )
    `)
    .eq('tierhalter_id', user.id)
    .eq('status', tab)
    .order('created_at', { ascending: false });

  const rows = (postings ?? []) as PostingRow[];

  const TABS: { key: PostingStatus; label: string }[] = [
    { key: 'offen', label: 'Offen' },
    { key: 'besetzt', label: 'Besetzt' },
    { key: 'abgeschlossen', label: 'Abgeschlossen' },
  ];

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1E3249]">Meine Gesuche</h1>
          <p className="text-[#4E779F] text-sm mt-1">Verwalte deine Betreuungsgesuche</p>
        </div>
        <Link
          href="/dashboard/postings/neu"
          className="bg-[#2E4A6B] text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-[#3A5A80] transition-colors text-sm"
        >
          + Neues Gesuch
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-[#EEF2F8] p-1 rounded-xl w-fit">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={`?tab=${t.key}`}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t.key
                ? 'bg-white text-[#1E3249] shadow-sm'
                : 'text-[#4E779F] hover:text-[#2E4A6B]'
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {/* Postings */}
      {rows.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#C8D8EC] shadow-sm p-12 text-center">
          <div className="text-4xl mb-4">📋</div>
          <p className="text-[#4E779F] mb-4">Keine {STATUS_CONFIG[tab].label.toLowerCase()}en Gesuche.</p>
          {tab === 'offen' && (
            <Link
              href="/dashboard/postings/neu"
              className="inline-block bg-[#2E4A6B] text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-[#3A5A80] transition-colors"
            >
              Erstes Gesuch erstellen
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {rows.map((posting) => {
            const empfohlen = posting.bewerbungen.filter((b) => b.quelle === 'empfehlung');
            const organisch = posting.bewerbungen.filter((b) => b.quelle === 'organisch');
            const statusCfg = STATUS_CONFIG[posting.status];

            return (
              <div key={posting.id} className="bg-white rounded-2xl border border-[#C8D8EC] shadow-sm p-6">
                {/* Posting Header */}
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="font-semibold text-[#1E3249]">
                        {LEISTUNG_LABEL[posting.leistung]}
                      </span>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusCfg.color}`}>
                        {statusCfg.label}
                      </span>
                    </div>
                    <p className="text-sm text-[#4E779F] mt-1">
                      {format(new Date(posting.datum_von), 'd. MMM yyyy', { locale: de })}
                      {posting.datum_von !== posting.datum_bis && (
                        <> – {format(new Date(posting.datum_bis), 'd. MMM yyyy', { locale: de })}</>
                      )}
                      {' · '}{posting.ort} ({posting.plz})
                    </p>
                  </div>
                  {posting.status === 'offen' && (
                    <form action={deletePostingAction}>
                      <input type="hidden" name="posting_id" value={posting.id} />
                      <button
                        type="submit"
                        className="text-sm text-red-500 hover:text-red-700 transition-colors"
                      >
                        Löschen
                      </button>
                    </form>
                  )}
                </div>

                {posting.nachricht && (
                  <p className="text-sm text-[#4E779F] mb-4 bg-[#EEF2F8] rounded-xl px-4 py-3">
                    {posting.nachricht}
                  </p>
                )}

                {/* Bewerber */}
                {posting.bewerbungen.length === 0 ? (
                  <p className="text-sm text-[#7A9DBF] italic">Noch keine Bewerbungen.</p>
                ) : (
                  <div className="space-y-4">
                    {/* Empfohlene */}
                    {empfohlen.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-[#7A9DBF] uppercase tracking-wide mb-2">
                          Empfohlene Sitter
                        </p>
                        <div className="space-y-2">
                          {empfohlen.map((b) => (
                            <BewerberRow key={b.id} b={b} postingId={posting.id} isOffen={posting.status === 'offen'} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Organische */}
                    {organisch.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-[#7A9DBF] uppercase tracking-wide mb-2">
                          Weitere Bewerber (Pinnwand)
                        </p>
                        <div className="space-y-2">
                          {organisch.map((b) => (
                            <BewerberRow key={b.id} b={b} postingId={posting.id} isOffen={posting.status === 'offen'} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function BewerberRow({
  b,
  postingId,
  isOffen,
}: {
  b: BewerbungRow;
  postingId: string;
  isOffen: boolean;
}) {
  const statusBadge: Record<string, string> = {
    ausstehend: 'bg-yellow-50 text-yellow-700',
    ausgewaehlt: 'bg-[#EEF2F8] text-[#2E4A6B]',
    abgelehnt: 'bg-red-50 text-red-500',
  };
  const statusLabel: Record<string, string> = {
    ausstehend: 'Ausstehend',
    ausgewaehlt: 'Ausgewählt',
    abgelehnt: 'Abgelehnt',
  };

  const initials = b.sitter?.full_name
    ? b.sitter.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#EEF2F8]">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#2E4A6B] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
          {initials}
        </div>
        <div>
          <p className="text-sm font-medium text-[#1E3249]">{b.sitter?.full_name ?? 'Unbekannt'}</p>
          {b.sitter?.ort && <p className="text-xs text-[#4E779F]">{b.sitter.ort}</p>}
          {b.nachricht && <p className="text-xs text-[#4E779F] mt-0.5 line-clamp-1">{b.nachricht}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusBadge[b.status]}`}>
          {statusLabel[b.status]}
        </span>
        {isOffen && b.status === 'ausstehend' && (
          <form action={respondToBewerbungAction} className="flex gap-1">
            <input type="hidden" name="bewerbung_id" value={b.id} />
            <input type="hidden" name="posting_id" value={postingId} />
            <button
              name="status"
              value="ausgewaehlt"
              className="text-xs bg-[#2E4A6B] text-white px-3 py-1.5 rounded-lg hover:bg-[#3A5A80] transition-colors"
            >
              Auswählen
            </button>
            <button
              name="status"
              value="abgelehnt"
              className="text-xs border border-[#C8D8EC] text-[#4E779F] px-3 py-1.5 rounded-lg hover:bg-[#EEF2F8] transition-colors"
            >
              Ablehnen
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
