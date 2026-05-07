import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const trustBadges = [
  '✓ Kostenlos für Sitter',
  '✓ Keine Provision',
  '✓ Nur Kreis Daun',
  '✓ Gegenseitige Bewertung',
];

const tierhalterSteps = [
  {
    step: '1',
    title: 'Tierprofil anlegen',
    desc: 'Foto, Name, Rasse und Besonderheiten Deines Tieres eintragen',
  },
  {
    step: '2',
    title: 'Zeitslot eintragen oder Sitter suchen',
    desc: 'Wann brauchst Du Hilfe? Oder schau direkt im Marktplatz',
  },
  {
    step: '3',
    title: 'Match anfragen → Chat → Bewertung',
    desc: 'Nimm Kontakt auf, triff Dich kurz und bewerte danach',
  },
];

const sitterSteps = [
  {
    step: '1',
    title: 'Gratis registrieren + Profil erstellen',
    desc: 'Kein Abo, keine Kosten – einfach loslegen',
  },
  {
    step: '2',
    title: 'Verfügbare Zeiten eintragen',
    desc: 'Zeig wann Du Zeit hast, Tiere zu betreuen',
  },
  {
    step: '3',
    title: 'Anfragen erhalten → kennenlernen → helfen',
    desc: 'Lerne die Tierhalter kennen und hilf Deiner Nachbarschaft',
  },
];

const features = [
  {
    icon: '🗓',
    title: 'Zeitleisten-Matching',
    desc: 'Trag Deine Verfügbarkeit ein – wir finden den passenden Match automatisch',
  },
  {
    icon: '📸',
    title: 'Betreuungsjournal',
    desc: 'Sitter teilen Foto-Updates während der Betreuung – Du siehst immer was los ist',
  },
  {
    icon: '⭐',
    title: 'Gegenseitige Bewertung',
    desc: 'Nach jedem Match bewerten sich beide Seiten mit Sternen',
  },
  {
    icon: '📍',
    title: 'Ortschaft-Suche',
    desc: 'Suche gezielt nach Sitter in Deiner Ortschaft oder im PLZ-Umkreis',
  },
  {
    icon: '💬',
    title: 'Direkter Chat',
    desc: 'Sprich Dich vor dem Match direkt ab – kein Vermittler dazwischen',
  },
  {
    icon: '🏪',
    title: 'Lokaler Marktplatz',
    desc: 'Tiergeschäfte und Tierärzte im Kreis Daun auf einen Blick',
  },
];

const ratgeberTeaser = [
  {
    icon: '🥾',
    title: 'Wandern mit Hund',
    desc: 'Die schönsten hundefreundlichen Routen rund um Daun, Manderscheid und die Dauner Maare',
  },
  {
    icon: '🏖',
    title: 'Hundestrand Freilinger See',
    desc: 'Der einzige offizielle Hundestrand der Region – am Freilinger See bei Blankenheim. Mit Hundewiese und Badebereich.',
  },
  {
    icon: '🏨',
    title: 'Hundefreundliche Unterkünfte',
    desc: 'Hotels, Ferienhäuser und Pensionen im Kreis Daun, die Deinen Vierbeiner herzlich willkommen heißen.',
  },
  {
    icon: '📖',
    title: 'Ratgeber Hund',
    desc: 'Erste Hilfe beim Hund, richtige Ernährung, Leinenpflicht in der Eifel – Basiswissen kompakt.',
  },
];

const testimonials = [
  {
    initials: 'SM',
    name: 'Sandra M.',
    ort: 'Daun',
    stars: 5,
    quote:
      'Super nett! Mein Hund war in besten Händen. Genau so stelle ich mir Nachbarschaftshilfe vor.',
  },
  {
    initials: 'PK',
    name: 'Peter K.',
    ort: 'Gillenfeld',
    stars: 5,
    quote:
      'Als Sitter macht das richtig Spaß. Tolle Plattform, keine Provision, einfach unkompliziert.',
  },
  {
    initials: 'AL',
    name: 'Anna L.',
    ort: 'Manderscheid',
    stars: 5,
    quote: 'Endlich eine lokale Alternative! Das Betreuungsjournal mit Fotos ist genial.',
  },
];

const sitterFeatures = [
  'Profil erstellen',
  'Verfügbarkeit eintragen',
  'Anfragen erhalten',
  'Bewertungen sammeln',
  'Betreuungsjournal teilen',
];

const tierhalterFeatures = [
  'Tierprofil mit Foto',
  'Sitter suchen & anfragen',
  'Zeitleisten-Matching',
  'Chat',
  'Bewertungen',
  'Marktplatz-Zugang',
];

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* ── Hero ──────────────────────────────────────────────── */}
        <section className="bg-gradient-to-br from-[#EEF2F8] to-[#D4E3F0] py-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#1E3249] leading-tight mb-6">
              Dein Hund in guten Händen –
              <br className="hidden sm:block" /> in Deiner Nachbarschaft
            </h1>
            <p className="text-lg md:text-xl text-[#4E779F] max-w-2xl mx-auto mb-10">
              Finde kostenlose, liebevolle Tiersitter direkt in Deiner Ortschaft im Kreis Daun.
              Kein Stress, kein Preisvergleich – echte Nachbarschaftshilfe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <Link
                href="/register"
                className="bg-[#2E4A6B] text-white px-8 py-3.5 rounded-2xl text-lg font-medium hover:bg-[#1E3249] transition-colors shadow-sm"
              >
                Sitter finden →
              </Link>
              <Link
                href="/register"
                className="border-2 border-[#2E4A6B] text-[#2E4A6B] px-8 py-3.5 rounded-2xl text-lg font-medium hover:bg-[#2E4A6B]/5 transition-colors"
              >
                Als Sitter anbieten →
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {trustBadges.map((badge) => (
                <span
                  key={badge}
                  className="bg-white/80 border border-[#A8C0DC] text-[#2E4A6B] text-sm px-4 py-1.5 rounded-full shadow-sm"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Wie es funktioniert ───────────────────────────────── */}
        <section id="wie-es-funktioniert" className="py-20 px-4 bg-white/70 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-[#1E3249] mb-3">
              Wie es funktioniert
            </h2>
            <p className="text-center text-[#4E779F] mb-12">
              Für Tierhalter und Sitter – einfach und transparent
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-[#EEF2F8] rounded-2xl p-8">
                <h3 className="text-xl font-bold text-[#2E4A6B] mb-6">Als Tierhalter</h3>
                <div className="flex flex-col gap-6">
                  {tierhalterSteps.map((s) => (
                    <div key={s.step} className="flex gap-4">
                      <div className="w-9 h-9 rounded-full bg-[#2E4A6B] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {s.step}
                      </div>
                      <div>
                        <div className="font-semibold text-[#1E3249]">{s.title}</div>
                        <div className="text-sm text-[#4E779F] mt-0.5">{s.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-[#F4A261] mb-6">Als Sitter</h3>
                <div className="flex flex-col gap-6">
                  {sitterSteps.map((s) => (
                    <div key={s.step} className="flex gap-4">
                      <div className="w-9 h-9 rounded-full bg-[#F4A261] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {s.step}
                      </div>
                      <div>
                        <div className="font-semibold text-[#1E3249]">{s.title}</div>
                        <div className="text-sm text-[#4E779F] mt-0.5">{s.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Features Grid ─────────────────────────────────────── */}
        <section className="py-20 px-4 bg-[#F0F5FB]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-[#1E3249] mb-3">Alles dabei</h2>
            <p className="text-center text-[#4E779F] mb-12">Was MeinTiersitter besonders macht</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-[#C8D8EC]"
                >
                  <div className="text-3xl mb-3">{f.icon}</div>
                  <h3 className="font-semibold text-[#1E3249] mb-2">{f.title}</h3>
                  <p className="text-sm text-[#4E779F]">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Ratgeber-Teaser ───────────────────────────────────── */}
        <section className="py-20 px-4 bg-white/70 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-[#1E3249] mb-3">
              Tipps &amp; Ausflüge für Hundebesitzer in der Vulkaneifel
            </h2>
            <p className="text-center text-[#4E779F] mb-12">
              Von Wanderwegen bis zum Hundestrand – alles was Du und Dein Hund in der Region braucht.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {ratgeberTeaser.map((r) => (
                <div
                  key={r.title}
                  className="border border-[#C8D8EC] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col bg-white"
                >
                  <div className="text-3xl mb-3">{r.icon}</div>
                  <h3 className="font-semibold text-[#1E3249] mb-2 text-sm">{r.title}</h3>
                  <p className="text-sm text-[#4E779F] flex-1">{r.desc}</p>
                  <Link
                    href="/ratgeber"
                    className="mt-4 text-sm text-[#2E4A6B] font-medium hover:underline"
                  >
                    Mehr lesen →
                  </Link>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Link
                href="/ratgeber"
                className="inline-block bg-[#2E4A6B] text-white px-8 py-3 rounded-2xl font-medium hover:bg-[#1E3249] transition-colors"
              >
                Alle Ratgeber-Themen →
              </Link>
            </div>
          </div>
        </section>

        {/* ── Community ─────────────────────────────────────────── */}
        <section className="py-20 px-4 bg-[#2E4A6B]">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">Direkt aus der Community</h2>
                <p className="text-[#A8C0DC] mb-8 text-lg leading-relaxed">
                  MeinTiersitter entstand aus der Facebook-Community des Kreises Daun. Wir bringen
                  Nachbarschaftshilfe auf das nächste Level.
                </p>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block border-2 border-white text-white px-6 py-3 rounded-2xl font-medium hover:bg-white/10 transition-colors"
                >
                  Zur Facebook-Gruppe
                </a>
              </div>
              <div className="flex flex-col gap-4">
                {testimonials.map((t) => (
                  <div key={t.name} className="bg-white rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-[#EEF2F8] text-[#2E4A6B] font-bold flex items-center justify-center text-sm flex-shrink-0">
                        {t.initials}
                      </div>
                      <div>
                        <div className="font-semibold text-[#1E3249] text-sm">{t.name}</div>
                        <div className="text-xs text-[#7A9DBF]">{t.ort}</div>
                      </div>
                      <div className="ml-auto text-[#F4A261] text-sm">
                        {'⭐'.repeat(t.stars)}
                      </div>
                    </div>
                    <p className="text-sm text-[#4E779F] italic">&ldquo;{t.quote}&rdquo;</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Pricing ───────────────────────────────────────────── */}
        <section className="py-20 px-4 bg-white/70 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-[#1E3249] mb-3">
              Transparent &amp; fair
            </h2>
            <p className="text-center text-[#4E779F] mb-12">
              Für Sitter immer kostenlos. Für Tierhalter nur ein kleiner Beitrag.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Sitter Card */}
              <div className="border border-[#C8D8EC] rounded-2xl p-8 bg-white">
                <h3 className="text-xl font-bold text-[#1E3249] mb-2">Sitter werden</h3>
                <div className="text-4xl font-bold text-[#1E3249] mb-1">Kostenlos</div>
                <div className="text-sm text-[#7A9DBF] mb-8">&nbsp;</div>
                <ul className="flex flex-col gap-3 mb-8">
                  {sitterFeatures.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-[#1E3249] text-sm">
                      <span className="text-[#2E4A6B] font-bold">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className="block text-center border-2 border-[#2E4A6B] text-[#2E4A6B] px-6 py-3 rounded-2xl font-medium hover:bg-[#2E4A6B]/5 transition-colors"
                >
                  Jetzt gratis registrieren
                </Link>
              </div>
              {/* Tierhalter Card */}
              <div className="border-2 border-[#2E4A6B] rounded-2xl p-8 shadow-lg bg-white">
                <h3 className="text-xl font-bold text-[#1E3249] mb-2">Tierhalter</h3>
                <div className="text-4xl font-bold text-[#2E4A6B] mb-1">
                  €1,90{' '}
                  <span className="text-xl font-normal text-[#4E779F]">/ Monat</span>
                </div>
                <div className="text-xs text-[#7A9DBF] mb-8">
                  Nur zur Deckung der Betriebskosten
                </div>
                <ul className="flex flex-col gap-3 mb-8">
                  {tierhalterFeatures.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-[#1E3249] text-sm">
                      <span className="text-[#2E4A6B] font-bold">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className="block text-center bg-[#2E4A6B] text-white px-6 py-3 rounded-2xl font-medium hover:bg-[#1E3249] transition-colors"
                >
                  Jetzt starten
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
