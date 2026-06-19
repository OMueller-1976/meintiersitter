'use client'

const SPENDEN_TEXT = `Tiersitti wird ehrenamtlich betrieben und ist für Tierhalter und Sitter komplett kostenlos. Wir freuen uns über jede Unterstützung zur Kostendeckung — bei höheren Spenden geben wir einen Teil an regionale Tierschutzvereine und -verbände in der Vulkaneifel weiter.`

interface Props {
  variant?: 'kompakt' | 'ausführlich'
}

function SpendenButton() {
  const link = process.env.NEXT_PUBLIC_STRIPE_DONATION_LINK
  if (!link || link.includes('PLATZHALTER')) return null
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block bg-[#2D6A4F] text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-[#1E4D38] transition-colors"
    >
      💚 Jetzt unterstützen
    </a>
  )
}

export default function SpendenHinweis({ variant = 'kompakt' }: Props) {
  if (variant === 'kompakt') {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-xs text-[#4E779F] leading-relaxed">
          Tiersitti ist kostenlos und ehrenamtlich. Unterstütze uns gerne!
        </p>
        <SpendenButton />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-bold text-[#1E3249]">Gefällt Dir unser Angebot? 🐾</h3>
      <p className="text-xs text-[#4E779F] leading-relaxed">{SPENDEN_TEXT}</p>
      <SpendenButton />
    </div>
  )
}
