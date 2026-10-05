// Validierungsregeln fuer die Registrierung (reine Funktionen, clientseitig nutzbar).
// Rueckgabe: Fehlermeldung oder undefined, wenn gueltig.

const COMMON_PASSWORDS = new Set([
  '123456789', '1234567890', '12345678', 'password', 'passwort', 'passwort1', 'passwort123',
  'qwertz123', 'qwertzuiop', 'qwerty123', 'abc123456', 'iloveyou', 'hallo12345', 'tiersitti',
  'tiersitti1', 'tiersitti123', '11111111', '00000000',
])

export function validateName(value: string): string | undefined {
  const v = value.trim()
  if (v.length < 2) return 'Bitte gib Deinen Namen an (mindestens 2 Zeichen).'
  if (!/[A-Za-zÀ-ÖØ-öø-ÿ]/.test(v)) return 'Der Name muss Buchstaben enthalten.'
  return undefined
}

export function validateEmail(value: string): string | undefined {
  const v = value.trim()
  if (!v) return 'E-Mail ist erforderlich.'
  // pragmatisch: lokaler Teil @ Domain mit mind. einem Punkt und TLD >= 2 Zeichen
  if (!/^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[A-Za-z]{2,}$/.test(v)) {
    return 'Bitte gib eine gültige E-Mail-Adresse ein (z. B. name@beispiel.de).'
  }
  return undefined
}

export function validatePassword(value: string): string | undefined {
  if (value.length < 10) return 'Mindestens 10 Zeichen.'
  if (!/[A-Za-zÀ-ÖØ-öø-ÿ]/.test(value) || !/\d/.test(value)) return 'Bitte mindestens einen Buchstaben und eine Ziffer verwenden.'
  if (COMMON_PASSWORDS.has(value.toLowerCase()) || /^(.)\1+$/.test(value)) {
    return 'Dieses Passwort ist zu einfach. Bitte wähle ein anderes.'
  }
  return undefined
}

export function validatePlz(value: string): string | undefined {
  if (!/^\d{5}$/.test(value)) return 'PLZ muss 5 Ziffern haben.'
  if (value === '00000') return 'Bitte gib eine gültige PLZ ein.'
  return undefined
}

export function validateOrt(value: string): string | undefined {
  const v = value.trim()
  if (v.length < 2) return 'Bitte gib Deinen Ort an.'
  if (!/[A-Za-zÀ-ÖØ-öø-ÿ]{2}/.test(v)) return 'Der Ort muss Buchstaben enthalten.'
  return undefined
}
