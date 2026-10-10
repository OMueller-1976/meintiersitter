# Regionen-Rollout Rheinland-Pfalz (+ NRW)

Stand: 10.10.2026 · Status: **Zuschnitt v2, wartet auf letzte Freigabe**

## Ziel
Komplette Abdeckung von Rheinland-Pfalz (24 Landkreise + 12 kreisfreie Städte) sowie mehrere NRW-Regionen.
Je Region: Beispiel-Einträge + individuell recherchierte Inhalte.

## Entscheidungen (von Oliver)
- Zuschnitt: **gebündelte Regionen** nach Naturraum
- Datenqualität: **nur belegte Angaben** (Quelle je Eintrag, Lücken bleiben leer)
- Rollout: **alles in einem Rutsch** (ein Branch, ein Review, ein Merge)
- NRW: **Aachen, Düren, Rhein-Sieg/Bonn** (bestätigt)

## Zuschnitt (Version 2, ländliche Räume stärker gebündelt)

### Rheinland-Pfalz: 10 Regionen für 36 Einheiten
| Slug | Region | Enthält | Status |
|---|---|---|---|
| daun | Vulkaneifel | Vulkaneifel | bestehend |
| wittlich | Mosel | Bernkastel-Wittlich, Cochem-Zell | bestehend, erweitert |
| koblenz | Koblenz, Hunsrück & Westerwald | Koblenz, Mayen-Koblenz, Rhein-Hunsrück, Rhein-Lahn, Westerwaldkreis, Altenkirchen | bestehend, erweitert |
| trier | Region Trier | Trier, Trier-Saarburg, Eifelkreis Bitburg-Prüm | neu |
| ahr | Ahr & Rhein | Ahrweiler, Neuwied | neu |
| nahe | Nahe & Rheinhessen | Bad Kreuznach, Birkenfeld, Alzey-Worms, Worms | neu |
| mainz | Mainz & Umgebung | Mainz, Mainz-Bingen | neu |
| vorderpfalz | Vorderpfalz | Ludwigshafen, Frankenthal, Speyer, Rhein-Pfalz-Kreis, Bad Dürkheim | neu |
| suedpfalz | Südpfalz | Neustadt a. d. W., Landau, Südliche Weinstraße, Germersheim | neu |
| westpfalz | Westpfalz | Kaiserslautern (Stadt + Kreis), Kusel, Donnersbergkreis, Pirmasens, Zweibrücken, Südwestpfalz | neu |

Prüfung der Zählung: 1 + 2 + 6 + 3 + 2 + 4 + 2 + 5 + 4 + 7 = 36. Jede Einheit steht genau einmal drin.

### NRW (bestätigt)
| Slug | Region | Status |
|---|---|---|
| euskirchen | Kreis Euskirchen | bestehend |
| aachen | Städteregion Aachen | neu |
| dueren | Kreis Düren | neu |
| rheinsieg | Rhein-Sieg-Kreis & Bonn | neu |

Gesamt: 14 Regionen (7 neue RLP, 3 neue NRW, 4 bestehende, davon 2 erweitert).

### Begründung der Bündelung
- Westerwald, Rhein-Lahn und Altenkirchen grenzen an Koblenz und teilen Mittelrhein/Lahn als Naturraum.
- Cochem-Zell gehört geografisch zur Mosel, daher zu Bernkastel-Wittlich statt zu Nahe/Lahn.
- Nahe und Rheinhessen sind touristisch eine gemeinsame Region ("Rheinhessen-Nahe").
- Bitburg-Prüm liegt in der Planungsregion Trier.
- Pfälzerwald-Kreise im Westen und Südwesten sind ländlich und dünn besiedelt, daher eine Region.
- Offene Frage: Nutzer, die sich in einem gebündelten Kreis registrieren (z. B. Cochem), bekommen die Region "Mosel" als Auswahl. Die Ortschaft bleibt frei wählbar.

## Umfang je Region (Inhalt nach `region-content/types.ts`)
- Wanderrouten (3–4, mit Hunde-Info, Länge, Startpunkt)
- Sehenswürdigkeiten (3–4, hundefreundlich)
- Tierheime (alle in der Region, Adresse vollständig)
- Hunde-Special / Hundestrand (regionaler Badeplatz oder Freilauf, sonst ehrlich weglassen)
- Anlaufstellen (Vereine, Tiertafeln, Notfall)
- Unterkünfte, hundefreundlich (3–4 + Tipps)
- Futterstationen / Tiertafeln
- Ratgeber-Seiten (Hund entlaufen, Wandern, Unterkünfte) mit regionalen Daten
- Marktplatz-Einträge (Tierärzte, Tiergeschäfte) aus echten Quellen
- Beispiel-Einträge: 4 Gesuche + Sitter mit lokalen Orten/PLZ, markiert `ist_beispiel`

## Technische Schritte
1. `regions.ts`: neue Regionen mit `dbRegion` + `contentFile`
2. `region-content/<slug>.ts` je Region + Eintrag in `index.ts`
3. Geocoding der Ortschaften je Region (Skripte wie `geocode-wittlich.mjs`)
4. `seed-beispiele.mjs` regional parametrisieren (Orte, PLZ, Namen)
5. Marktplatz-Seed je Region (Migration)
6. Sitemap + Region-Auswahl auf der Startseite (aktuell 4 Kacheln, dann ~20: Gruppierung nach Bundesland nötig)
7. Typecheck, Lint, Build, Preview-Prüfung, danach Merge

## Risiken
- **Datenqualität:** Bestehende Einträge sind teils unvollständig (z. B. Tierheim Mayen ohne Straße). Diese werden mit überprüft.
- **Saving Paws** deckt nur Vulkaneifel/Südeifel ab. Für andere Regionen nur ehrlicher Hinweis, keine Zusage.
- **Echte Betriebe** (Unterkünfte, Tierärzte): nur mit Quelle, keine Bewertungen oder Zitate erfunden.
- **Beispiel-Accounts** brauchen den Service-Role-Key aus `.env.local`. Das Seed-Skript muss lokal laufen (Claude Code oder Terminal), nicht aus dieser Sandbox.
- **Umfang "alles in einem Rutsch":** 16+ Regionen auf einmal sind ein großer Review. Vorschlag: ein Branch, aber Preview-Prüfung vor dem Merge.
