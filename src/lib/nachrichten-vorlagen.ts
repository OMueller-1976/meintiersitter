export const VORLAGEN_TIERHALTER_AN_SITTER = [
  {
    id: 'interesse',
    label: 'Interesse bekunden',
    text: (sitterName: string) =>
      `Hallo ${sitterName}, ich habe Dein Sitter-Profil gesehen und würde mich freuen, wenn Du Dir mein Gesuch ansiehst. Hättest Du in nächster Zeit Zeit?`,
  },
  {
    id: 'frage_verfuegbarkeit',
    label: 'Nach Verfügbarkeit fragen',
    text: (sitterName: string) =>
      `Hallo ${sitterName}, bist Du in den nächsten Wochen für eine Tierbetreuung verfügbar? Ich würde gerne mehr Details besprechen.`,
  },
  {
    id: 'frage_erfahrung',
    label: 'Nach Erfahrung fragen',
    text: (sitterName: string) =>
      `Hallo ${sitterName}, magst Du mir etwas mehr über Deine Erfahrung mit Tieren erzählen? Das würde mir bei der Entscheidung helfen.`,
  },
]

export const VORLAGEN_SITTER_AN_TIERHALTER = [
  {
    id: 'bewerbung_kurz',
    label: 'Kurz vorstellen',
    text: (tierName: string) =>
      `Hallo! Ich interessiere mich für die Betreuung von ${tierName}. Ich habe Erfahrung mit Tieren und würde mich über ein Kennenlernen freuen.`,
  },
  {
    id: 'frage_details',
    label: 'Nach Details fragen',
    text: (tierName: string) =>
      `Hallo! Magst Du mir mehr Details zu ${tierName} und der gewünschten Betreuung erzählen? Dann kann ich besser einschätzen ob ich passe.`,
  },
  {
    id: 'verfuegbar',
    label: 'Verfügbarkeit bestätigen',
    text: (tierName: string) =>
      `Hallo! Ich bin im genannten Zeitraum verfügbar und würde mich gerne um ${tierName} kümmern. Lass uns die Details besprechen!`,
  },
]
