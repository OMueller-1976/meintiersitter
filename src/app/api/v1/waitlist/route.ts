import { NextResponse, type NextRequest } from 'next/server'

// Simple waitlist — stores to a Supabase table when implemented.
// For now returns success to unblock the UI flow.
export async function POST(request: NextRequest) {
  try {
    const body = await request.formData()
    const email = body.get('email')
    const landkreis = body.get('landkreis')

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Ungültige E-Mail-Adresse' }, { status: 400 })
    }

    // TODO: persist to waitlist table when created
    console.log(`Waitlist signup: ${email} for ${landkreis}`)

    // Redirect back with success param
    return NextResponse.redirect(
      new URL(`?waitlist=success`, request.url),
      { status: 303 }
    )
  } catch {
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 })
  }
}
