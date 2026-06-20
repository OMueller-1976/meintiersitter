'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { format, isToday, isYesterday } from 'date-fns';
import { de } from 'date-fns/locale';
import toast from 'react-hot-toast';
import BewertungsModal from '@/components/ui/BewertungsModal';
import { sendNachricht, markAsRead, abschliessenMatch, shareJournalUpdate } from './actions';
import { KontaktanfrageButtons } from '../anfragen/AnfrageActionButtons';
import type { Match, Nachricht, Profile, TierProfile, JournalEintrag } from '@/types';

// ── Types ────────────────────────────────────────────────────

type MatchRow = Match & {
  tierhalter: Pick<Profile, 'id' | 'full_name' | 'avatar_url'> | null;
  sitter: Pick<Profile, 'id' | 'full_name' | 'avatar_url'> | null;
  tier: Pick<TierProfile, 'name' | 'tierart'> | null;
  lastMsg?: string;
  unread?: number;
};

type NachrichtRow = Nachricht & {
  journalEintrag?: JournalEintrag | null;
};

const LEISTUNG_EMOJI: Record<string, string> = {
  gassi: '🐕',
  fuettern: '🍽️',
  tagesbetreuung: '🏠',
  uebernachtung: '🌙',
};

// ── Helpers ───────────────────────────────────────────────────

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

function dayLabel(dateStr: string) {
  const d = new Date(dateStr);
  if (isToday(d)) return 'Heute';
  if (isYesterday(d)) return 'Gestern';
  return format(d, 'd. MMMM yyyy', { locale: de });
}

// ── Main Component ────────────────────────────────────────────

export default function NachrichtenPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'tierhalter' | 'sitter' | 'beide' | 'admin'>('tierhalter');
  const [matches, setMatches] = useState<MatchRow[]>([]);
  const [activeMatch, setActiveMatch] = useState<MatchRow | null>(null);
  const [nachrichten, setNachrichten] = useState<NachrichtRow[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [showBewertungsModal, setShowBewertungsModal] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // ── Initial load ──────────────────────────────────────────

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      if (profile) setUserRole(profile.role);

      const { data: matchData } = await supabase
        .from('matches')
        .select(`
          *,
          tierhalter:profiles!tierhalter_id(id, full_name, avatar_url),
          sitter:profiles!sitter_id(id, full_name, avatar_url),
          tier:tier_profiles(name, tierart)
        `)
        .or(`tierhalter_id.eq.${user.id},sitter_id.eq.${user.id}`)
        .in('status', ['angefragt', 'bestaetigt', 'abgeschlossen'])
        .order('updated_at', { ascending: false });

      if (matchData) {
        const enriched = await Promise.all(
          (matchData as MatchRow[]).map(async (m) => {
            const { data: lastMsgs } = await supabase
              .from('nachrichten')
              .select('inhalt, gelesen, sender_id')
              .eq('match_id', m.id)
              .order('created_at', { ascending: false })
              .limit(1);
            const { count } = await supabase
              .from('nachrichten')
              .select('id', { count: 'exact', head: true })
              .eq('match_id', m.id)
              .neq('sender_id', user.id)
              .eq('gelesen', false);
            return {
              ...m,
              lastMsg: lastMsgs?.[0]?.inhalt?.startsWith('__journal__')
                ? '📸 Journal-Update'
                : lastMsgs?.[0]?.inhalt ?? '',
              unread: count ?? 0,
            };
          })
        );
        setMatches(enriched);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Load messages ─────────────────────────────────────────

  const loadMessages = useCallback(async (matchId: string) => {
    const { data } = await supabase
      .from('nachrichten')
      .select('*')
      .eq('match_id', matchId)
      .order('created_at', { ascending: true });

    if (!data) return;

    const journalIds = data
      .filter((n) => n.inhalt?.startsWith('__journal__:'))
      .map((n) => n.inhalt.replace('__journal__:', ''));

    let journalMap: Record<string, JournalEintrag> = {};
    if (journalIds.length > 0) {
      const { data: journals } = await supabase
        .from('journal_eintraege')
        .select('*')
        .in('id', journalIds);
      journalMap = Object.fromEntries((journals ?? []).map((j) => [j.id, j]));
    }

    setNachrichten(
      data.map((n) => ({
        ...n,
        journalEintrag: n.inhalt?.startsWith('__journal__:')
          ? journalMap[n.inhalt.replace('__journal__:', '')] ?? null
          : null,
      }))
    );
  }, [supabase]);

  // ── Realtime subscription ─────────────────────────────────

  useEffect(() => {
    if (!activeMatch || !userId) return;

    loadMessages(activeMatch.id);
    markAsRead(activeMatch.id);

    if (channelRef.current) supabase.removeChannel(channelRef.current);

    const channel = supabase
      .channel('nachrichten:' + activeMatch.id)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'nachrichten',
          filter: `match_id=eq.${activeMatch.id}`,
        },
        async (payload) => {
          const newMsg = payload.new as Nachricht;
          let journalEintrag: JournalEintrag | null = null;
          if (newMsg.inhalt?.startsWith('__journal__:')) {
            const jid = newMsg.inhalt.replace('__journal__:', '');
            const { data } = await supabase
              .from('journal_eintraege')
              .select('*')
              .eq('id', jid)
              .single();
            journalEintrag = data ?? null;
          }
          setNachrichten((prev) => [...prev, { ...newMsg, journalEintrag }]);
          if (document.hasFocus()) markAsRead(activeMatch.id);
        }
      )
      .subscribe();

    channelRef.current = channel;
    return () => { supabase.removeChannel(channel); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMatch?.id, userId]);

  // ── Auto-scroll ───────────────────────────────────────────

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [nachrichten]);

  // ── Send message ──────────────────────────────────────────

  const handleSend = async () => {
    if (!input.trim() || !activeMatch || sending) return;
    setSending(true);
    const text = input.trim();
    setInput('');
    const result = await sendNachricht(activeMatch.id, text);
    setSending(false);
    if (result.error) toast.error(result.error);
  };

  const selectMatch = (m: MatchRow) => {
    setActiveMatch(m);
    setShowMobileChat(true);
    setMatches((prev) => prev.map((x) => x.id === m.id ? { ...x, unread: 0 } : x));
  };

  const gegenueberOf = (m: MatchRow) =>
    userId === m.tierhalter_id ? m.sitter : m.tierhalter;

  const gegenueberOfActive = activeMatch ? gegenueberOf(activeMatch) : null;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* ── Konversationsliste ────────────────────────────── */}
      <div
        className={`${
          showMobileChat ? 'hidden md:flex' : 'flex'
        } md:flex flex-col w-full md:w-72 border-r border-gray-100 bg-white flex-shrink-0`}
      >
        <div className="px-5 py-4 border-b border-gray-100">
          <h1 className="text-lg font-bold text-gray-900">Nachrichten</h1>
        </div>

        {matches.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-6 text-center">
            <div>
              <div className="text-4xl mb-3">💬</div>
              <p className="text-sm text-gray-500">
                Noch keine Nachrichten.
                <br />
                Sobald ein Match bestätigt wird,
                <br />
                öffnet sich hier der Chat.
              </p>
            </div>
          </div>
        ) : (
          <ul className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {matches.map((m) => {
              const other = gegenueberOf(m);
              const isActive = activeMatch?.id === m.id;
              return (
                <li key={m.id}>
                  <button
                    onClick={() => selectMatch(m)}
                    className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${
                      isActive ? 'border-l-4 border-[#2D6A4F] bg-green-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#2D6A4F] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {other?.full_name ? getInitials(other.full_name) : '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {other?.full_name ?? 'Unbekannt'}
                        </p>
                        {(m.unread ?? 0) > 0 && (
                          <span className="flex-shrink-0 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                            {m.unread}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {LEISTUNG_EMOJI[m.leistung ?? ''] ?? ''}{' '}
                        {m.tier?.name ?? ''}{' '}
                        · {format(new Date(m.datum_von), 'd. MMM', { locale: de })}
                      </p>
                      {m.lastMsg && (
                        <p className="text-xs text-gray-400 truncate mt-0.5">{m.lastMsg}</p>
                      )}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* ── Chat-Fenster ──────────────────────────────────── */}
      <div
        className={`${
          showMobileChat ? 'flex' : 'hidden md:flex'
        } flex-1 flex-col bg-[#F9FAFB] overflow-hidden`}
      >
        {!activeMatch ? (
          <div className="flex-1 flex items-center justify-center text-center p-6">
            <div>
              <div className="text-5xl mb-4">💬</div>
              <p className="text-gray-400">Wähle eine Konversation aus</p>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="bg-white border-b border-gray-100 px-5 py-3 flex items-center justify-between gap-3 flex-shrink-0">
              <div className="flex items-center gap-3">
                <button
                  className="md:hidden text-gray-500 mr-1"
                  onClick={() => setShowMobileChat(false)}
                >
                  ←
                </button>
                <div className="w-9 h-9 rounded-full bg-[#2D6A4F] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {gegenueberOfActive?.full_name ? getInitials(gegenueberOfActive.full_name) : '?'}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {gegenueberOfActive?.full_name ?? 'Unbekannt'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {activeMatch.tier?.name ?? ''}{' '}
                    · {format(new Date(activeMatch.datum_von), 'd. MMM', { locale: de })}
                    {activeMatch.datum_von !== activeMatch.datum_bis &&
                      ` – ${format(new Date(activeMatch.datum_bis), 'd. MMM', { locale: de })}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    activeMatch.status === 'angefragt'
                      ? 'bg-yellow-100 text-yellow-700'
                      : activeMatch.status === 'bestaetigt'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {activeMatch.status === 'angefragt' ? 'Ausstehend' :
                   activeMatch.status === 'bestaetigt' ? 'Aktiv' : 'Abgeschlossen'}
                </span>
                {activeMatch.status === 'angefragt' && (userId === activeMatch.sitter_id) && (
                  <KontaktanfrageButtons matchId={activeMatch.id} />
                )}
                {activeMatch.status === 'bestaetigt' && (() => {
                  const ichBinTierhalter = userId === activeMatch.tierhalter_id;
                  const ichBinSitter = userId === activeMatch.sitter_id;
                  const meinFlag = ichBinTierhalter
                    ? activeMatch.tierhalter_bestaetigt_abschluss
                    : activeMatch.sitter_bestaetigt_abschluss;
                  const gegenparteiName = ichBinTierhalter
                    ? (activeMatch.sitter?.full_name ?? 'dem Sitter')
                    : (activeMatch.tierhalter?.full_name ?? 'dem Tierhalter');
                  if ((ichBinTierhalter || ichBinSitter) && !meinFlag) {
                    return (
                      <button
                        onClick={async () => {
                          const result = await abschliessenMatch(activeMatch.id);
                          if (result.error) {
                            toast.error(result.error);
                          } else if (result.nowAbgeschlossen) {
                            setActiveMatch({ ...activeMatch, status: 'abgeschlossen' });
                            setMatches((prev) =>
                              prev.map((m) =>
                                m.id === activeMatch.id ? { ...m, status: 'abgeschlossen' } : m
                              )
                            );
                            toast.success('Betreuung abgeschlossen!');
                          } else {
                            const updatedFlag = ichBinTierhalter
                              ? { tierhalter_bestaetigt_abschluss: true }
                              : { sitter_bestaetigt_abschluss: true };
                            setActiveMatch({ ...activeMatch, ...updatedFlag });
                            setMatches((prev) =>
                              prev.map((m) =>
                                m.id === activeMatch.id ? { ...m, ...updatedFlag } : m
                              )
                            );
                            toast.success('Bestätigt — warte auf die andere Seite.');
                          }
                        }}
                        className="text-xs border border-[#2D6A4F] text-[#2D6A4F] px-3 py-1.5 rounded-xl hover:bg-green-50 transition-colors"
                      >
                        Abschließen
                      </button>
                    );
                  }
                  if ((ichBinTierhalter || ichBinSitter) && meinFlag) {
                    return (
                      <span className="text-xs text-gray-400 px-2">
                        Du hast bestätigt — warte auf {gegenparteiName}
                      </span>
                    );
                  }
                  return null;
                })()}
                {activeMatch.status === 'abgeschlossen' && (
                  <button
                    onClick={() => setShowBewertungsModal(true)}
                    className="text-xs bg-[#F4A261] text-white px-3 py-1.5 rounded-xl hover:bg-[#e08a44] transition-colors"
                  >
                    Jetzt bewerten ⭐
                  </button>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <MessageList
                nachrichten={nachrichten}
                userId={userId ?? ''}
                bottomRef={bottomRef}
              />
            </div>

            {/* Input */}
            <div className="bg-white border-t border-gray-100 px-4 py-3 flex-shrink-0">
              {activeMatch.status === 'angefragt' ? (
                <p className="text-sm text-gray-400 text-center py-1">
                  {userId === activeMatch.sitter_id
                    ? 'Nimm die Anfrage an, um zu antworten.'
                    : 'Warte auf Antwort des Sitters…'}
                </p>
              ) : activeMatch.status !== 'bestaetigt' && activeMatch.status !== 'abgeschlossen' ? (
                <p className="text-sm text-gray-400 text-center py-1">Chat nicht verfügbar</p>
              ) : activeMatch.status === 'abgeschlossen' ? (
                <p className="text-sm text-gray-400 text-center py-1">Betreuung abgeschlossen</p>
              ) : (
                <div className="flex items-end gap-2">
                  {(userRole === 'sitter' || userRole === 'beide') && (
                    <button
                      onClick={() => setShowJournalModal(true)}
                      className="text-gray-400 hover:text-[#2D6A4F] transition-colors pb-2 text-xl"
                      title="Journal-Update teilen"
                    >
                      📸
                    </button>
                  )}
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Nachricht schreiben…"
                    rows={1}
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || sending}
                    className="bg-[#2D6A4F] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#245a42] transition-colors disabled:opacity-40 flex-shrink-0"
                  >
                    Senden
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      {showJournalModal && activeMatch && (
        <JournalModal matchId={activeMatch.id} onClose={() => setShowJournalModal(false)} />
      )}
      {showBewertungsModal && activeMatch && gegenueberOfActive && (
        <BewertungsModal
          matchId={activeMatch.id}
          bewertetId={gegenueberOfActive.id}
          bewertetName={gegenueberOfActive.full_name ?? 'Unbekannt'}
          onClose={() => setShowBewertungsModal(false)}
        />
      )}
    </div>
  );
}

// ── MessageList ────────────────────────────────────────────────

function MessageList({
  nachrichten,
  userId,
  bottomRef,
}: {
  nachrichten: NachrichtRow[];
  userId: string;
  bottomRef: React.RefObject<HTMLDivElement>;
}) {
  let lastDay = '';

  return (
    <>
      {nachrichten.map((n) => {
        const day = dayLabel(n.created_at);
        const showDay = day !== lastDay;
        lastDay = day;
        const isOwn = n.sender_id === userId;

        return (
          <div key={n.id}>
            {showDay && (
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 font-medium">{day}</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
            )}
            {n.journalEintrag ? (
              <JournalCard journal={n.journalEintrag} time={n.created_at} />
            ) : (
              <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-1`}>
                <div
                  className={`max-w-[75%] px-4 py-2.5 text-sm ${
                    isOwn
                      ? 'bg-[#2D6A4F] text-white rounded-2xl rounded-br-sm'
                      : 'bg-white text-gray-900 rounded-2xl rounded-bl-sm border border-gray-100'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{n.inhalt}</p>
                  <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : ''}`}>
                    <span className={`text-[10px] ${isOwn ? 'text-green-200' : 'text-gray-400'}`}>
                      {format(new Date(n.created_at), 'HH:mm')}
                    </span>
                    {isOwn && (
                      <span className={`text-[10px] ${n.gelesen ? 'text-green-300' : 'text-green-600'}`}>
                        {n.gelesen ? '✓✓' : '✓'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
      <div ref={bottomRef} />
    </>
  );
}

// ── JournalCard ────────────────────────────────────────────────

function JournalCard({ journal, time }: { journal: JournalEintrag; time: string }) {
  return (
    <div className="my-3 border-2 border-green-200 rounded-2xl overflow-hidden bg-white max-w-sm mx-auto">
      <div className="px-4 py-2 bg-green-50 text-xs font-semibold text-green-700">
        📸 Journal-Update
      </div>
      {journal.foto_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={journal.foto_url} alt="Journal-Foto" className="w-full max-h-48 object-cover" />
      )}
      <div className="px-4 py-3">
        <p className="text-sm text-gray-800">{journal.nachricht}</p>
        <p className="text-[10px] text-gray-400 mt-1">{format(new Date(time), 'HH:mm')}</p>
      </div>
    </div>
  );
}

// ── JournalModal ───────────────────────────────────────────────

function JournalModal({ matchId, onClose }: { matchId: string; onClose: () => void }) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [nachricht, setNachricht] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFile = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async () => {
    if (!nachricht.trim()) { toast.error('Bitte schreib eine Nachricht.'); return; }
    setLoading(true);

    let fotoUrl: string | null = null;
    if (file) {
      const ext = file.name.split('.').pop();
      const path = `${matchId}/${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage
        .from('journal-fotos')
        .upload(path, file, { upsert: false });
      if (!uploadErr) {
        const { data: urlData } = supabase.storage.from('journal-fotos').getPublicUrl(path);
        fotoUrl = urlData.publicUrl;
      }
    }

    const result = await shareJournalUpdate(matchId, fotoUrl, nachricht.trim());
    setLoading(false);
    if (result.error) toast.error(result.error);
    else {
      toast.success('Update geteilt!');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Journal-Update teilen</h2>
        <div
          className="border-2 border-dashed border-gray-200 rounded-xl p-4 mb-4 text-center cursor-pointer hover:border-[#2D6A4F] transition-colors"
          onClick={() => document.getElementById('journal-foto')?.click()}
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Vorschau" className="max-h-40 mx-auto rounded-xl object-cover" />
          ) : (
            <p className="text-sm text-gray-400">📷 Foto auswählen (optional)</p>
          )}
          <input
            id="journal-foto"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </div>
        <textarea
          value={nachricht}
          onChange={(e) => setNachricht(e.target.value)}
          placeholder="Was macht Dein Schützling gerade?"
          rows={3}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] mb-4"
        />
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-[#2D6A4F] text-white font-semibold py-2.5 rounded-xl hover:bg-[#245a42] transition-colors disabled:opacity-50"
          >
            {loading ? 'Wird geteilt…' : 'Update teilen'}
          </button>
          <button
            onClick={onClose}
            className="border border-gray-200 text-gray-600 px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Abbrechen
          </button>
        </div>
      </div>
    </div>
  );
}
