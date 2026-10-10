# Regionen-Rollout Rheinland-Pfalz (+ NRW)

Stand: 10.10.2026 · Status: **Plan, wartet auf Freigabe**

## Ziel
Komplette Abdeckung von Rheinland-Pfalz (24 Landkreise + 12 kreisfreie Städte) sowie mehrere NRW-Regionen.
Je Region: Beispiel-Einträge + individuell recherchierte Inhalte.

## Entscheidungen (von Oliver)
- Zuschnitt: **gebündelte Regionen** nach Naturraum
- Datenqualität: **nur belegte Angaben** (Quelle je Eintrag, Lücken bleiben leer)
- Rollout: **alles in einem Rutsch** (ein Branch, ein Review, ein Merge)
- NRW: **Aachen + weitere** (Liste unten, bitte bestätigen)

## Vorschlag Zuschnitt (Slug · Name · enthaltene Kreise)

### Bestehend
| Slug | Region | Enthält |
|---|---|---|
| daun | Vulkaneifel | Vulkaneifel |
| wittlich | Bernkastel-Wittlich | Bernkastel-Wittlich |
| koblenz | Koblenz & Hunsrück | Koblenz, Mayen-Koblenz, Rhein-Hunsrück (Umfang vor Start prüfen) |
| euskirchen | Kreis Euskirchen (NRW) | Euskirchen |

### Neu RLP (13)
| Slug | Region | Enthält |
|---|---|---|
| bitburg | Eifel Bitburg-Prüm | Eifelkreis Bitburg-Prüm |
| trier | Trier & Saarburg | Trier, Trier-Saarburg |
| cochem | Cochem-Zell | Cochem-Zell |
| ahr | Ahr & Mittelrhein | Ahrweiler, Neuwied |
| westerwald | Westerwald | Westerwaldkreis, Altenkirchen |
| lahn | Rhein-Lahn | Rhein-Lahn-Kreis |
| nahe | Nahe & Hunsrück-Süd | Bad Kreuznach, Birkenfeld |
| mainz | Mainz & Umgebung | Mainz, Mainz-Bingen |
| rheinhessen | Rheinhessen | Alzey-Worms, Worms |
| vorderpfalz | Vorderpfalz | Ludwigshafen, Frankenthal, Speyer, Rhein-Pfalz-Kreis, Bad Dürkheim |
| suedpfalz | Südpfalz | Neustadt a. d. W., Landau, Südliche Weinstraße, Germersheim |
| westpfalz | Westpfalz | Kaiserslautern (Stadt + Kreis), Kusel, Donnersbergkreis |
| suedwestpfalz | Südwestpfalz | Pirmasens, Zweibrücken, Südwestpfalz |

Prüfung: 3 bestehende RLP-Regionen (5 Kreise) + 13 neue = alle 36 Einheiten abgedeckt.

### NRW (Vorschlag, bitte bestätigen oder ändern)
| Slug | Region |
|---|---|
| aachen | Städteregion Aachen |
| dueren | Kreis Düren |
| rheinsieg | Rhein-Sieg-Kreis & Bonn |

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
