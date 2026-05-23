export const dynamic = 'force-dynamic'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Tiersitti – Nachrichten' }

export default async function ChatPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: conversations } = await supabase
    .from('conversations')
    .select(`
      id, last_message_at, created_at,
      participant_a, participant_b,
      messages ( id, content, is_read, sender_id, created_at )
    `)
    .or(`participant_a.eq.${user.id},participant_b.eq.${user.id}`)
    .order('last_message_at', { ascending: false })

  return (
    <div className="min-h-screen">
      {/* Header */}
      <nav className="sticky top-0 z-50" style={{ background: 'rgba(15,76,129,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/" className="text-xl font-extrabold text-white">🐾 Tiersitti</Link>
          <span className="text-white/40">/</span>
          <span className="text-sm font-semibold text-white/80">Nachrichten</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-extrabold mb-6">Deine Nachrichten</h1>

        {!conversations || conversations.length === 0 ? (
          <div className="tile p-10 text-center">
            <div className="text-4xl mb-4">💬</div>
            <p className="font-bold mb-2">Noch keine Nachrichten</p>
            <p className="text-sm text-muted mb-6">
              Schreibe einem Sitter, um ein Gespräch zu starten.
            </p>
            <Link href="/rheinland-pfalz/daun" className="btn-primary inline-block px-6 py-2.5">
              Sitter entdecken
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {conversations.map((conv) => {
              const msgs = (conv.messages as { id: string; content: string; is_read: boolean; sender_id: string; created_at: string }[] | null) ?? []
              const lastMsg = msgs[0]
              const unread = msgs.filter((m) => !m.is_read && m.sender_id !== user.id).length
              const otherId = conv.participant_a === user.id ? conv.participant_b : conv.participant_a

              return (
                <Link
                  key={conv.id}
                  href={`/chat/${conv.id}`}
                  className="tile p-4 flex items-center gap-4 hover:opacity-90 transition-opacity"
                >
                  {/* Avatar placeholder */}
                  <div
                    className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-slate-900"
                    style={{ background: 'var(--accent-green)' }}
                  >
                    {otherId?.slice(0, 2).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm truncate">Konversation</div>
                    {lastMsg && (
                      <div className="text-xs text-muted truncate mt-0.5">{lastMsg.content}</div>
                    )}
                  </div>

                  {unread > 0 && (
                    <span
                      className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 text-white"
                      style={{ background: '#ef4444' }}
                    >
                      {unread}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
