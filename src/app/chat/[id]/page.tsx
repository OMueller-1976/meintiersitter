'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { use } from 'react'

interface Message {
  id: string
  content: string
  sender_id: string
  is_read: boolean
  created_at: string
}

interface Props {
  params: Promise<{ id: string }>
}

export default function ChatConversationPage({ params }: Props) {
  const { id } = use(params)
  const supabase = createClient()
  const router = useRouter()

  const [messages, setMessages] = useState<Message[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/login'); return }
      setUserId(data.user.id)
    })
  }, [supabase, router])

  useEffect(() => {
    if (!userId) return

    // Load messages
    supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', id)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        if (data) setMessages(data)
      })

    // Mark as read
    supabase
      .from('messages')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('conversation_id', id)
      .neq('sender_id', userId)
      .then(() => {})

    // Realtime subscription
    const channel = supabase
      .channel(`conversation:${id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${id}`,
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new as Message])
        if (payload.new.sender_id !== userId) {
          supabase.from('messages').update({ is_read: true, read_at: new Date().toISOString() }).eq('id', payload.new.id).then(() => {})
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [userId, id, supabase])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || !userId || sending) return
    setSending(true)
    const content = input.trim()
    setInput('')

    await supabase.from('messages').insert({
      conversation_id: id,
      sender_id: userId,
      content,
    })

    await supabase
      .from('conversations')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', id)

    setSending(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <nav className="sticky top-0 z-50" style={{ background: 'rgba(15,76,129,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.12)', flexShrink: 0 }}>
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/chat" className="text-white/70 hover:text-white transition-colors text-sm">← Zurück</Link>
          <span className="font-bold text-white">Chat</span>
        </div>
      </nav>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto max-w-2xl mx-auto w-full px-4 py-6 space-y-3">
        {messages.map((msg) => {
          const isOwn = msg.sender_id === userId
          return (
            <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
              <div
                className="max-w-xs md:max-w-sm px-4 py-2.5 rounded-2xl text-sm"
                style={{
                  background: isOwn ? 'var(--chat-bubble-own)' : 'var(--chat-bubble-other)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderBottomRightRadius: isOwn ? 4 : undefined,
                  borderBottomLeftRadius: !isOwn ? 4 : undefined,
                }}
              >
                <p>{msg.content}</p>
                <p className="text-xs text-muted mt-1 text-right">
                  {new Date(msg.created_at).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="sticky bottom-0 px-4 py-3 max-w-2xl mx-auto w-full" style={{ background: 'rgba(15,76,129,0.6)', backdropFilter: 'blur(12px)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
            placeholder="Nachricht schreiben..."
            className="glass-input flex-1"
            aria-label="Nachricht eingeben"
            disabled={sending}
          />
          <button
            onClick={handleSend}
            disabled={sending || !input.trim()}
            className="px-4 py-2 rounded-xl font-bold text-slate-900 text-sm disabled:opacity-50 cursor-pointer"
            style={{ background: 'var(--accent-green)', flexShrink: 0 }}
            aria-label="Nachricht senden"
          >
            Senden
          </button>
        </div>
      </div>
    </div>
  )
}
