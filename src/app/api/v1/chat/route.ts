import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('conversations')
    .select('id, last_message_at, created_at, participant_a, participant_b')
    .or(`participant_a.eq.${user.id},participant_b.eq.${user.id}`)
    .order('last_message_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json() as { recipientId: string; careRequestId?: string; message: string }
  const { recipientId, careRequestId, message } = body

  if (!recipientId || !message) {
    return NextResponse.json({ error: 'recipientId and message required' }, { status: 400 })
  }

  // Check if conversation already exists
  const { data: existing } = await supabase
    .from('conversations')
    .select('id')
    .or(`and(participant_a.eq.${user.id},participant_b.eq.${recipientId}),and(participant_a.eq.${recipientId},participant_b.eq.${user.id})`)
    .maybeSingle()

  let conversationId = existing?.id

  if (!conversationId) {
    const { data: newConv, error: convErr } = await supabase
      .from('conversations')
      .insert({ participant_a: user.id, participant_b: recipientId, care_request_id: careRequestId ?? null, last_message_at: new Date().toISOString() })
      .select('id')
      .single()

    if (convErr) return NextResponse.json({ error: convErr.message }, { status: 500 })
    conversationId = newConv.id
  }

  const { error: msgErr } = await supabase
    .from('messages')
    .insert({ conversation_id: conversationId, sender_id: user.id, content: message })

  if (msgErr) return NextResponse.json({ error: msgErr.message }, { status: 500 })

  return NextResponse.json({ conversationId }, { status: 201 })
}
