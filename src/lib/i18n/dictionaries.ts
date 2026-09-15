export const dictionaries = {
  en: {
    signOut: "Sign out",
    courses: "Courses",
    upToDate: "You're up to date",
    upToDateBody: "You've met every training requirement for this year. Nice work.",
    recommended: "Recommended for you",
    start: "Start",
    continue: "Continue",
    certificate: "Certificate",
    clockHours: "clock hours",
    switchLanguage: "Español",
  },
  es: {
    signOut: "Cerrar sesión",
    courses: "Cursos",
    upToDate: "Estás al día",
    upToDateBody: "Has cumplido con todos los requisitos de capacitación de este año. Buen trabajo.",
    recommended: "Recomendado para ti",
    start: "Comenzar",
    continue: "Continuar",
    certificate: "Certificado",
    clockHours: "horas reloj",
    switchLanguage: "English",
  },
} as const;

export type Locale = keyof typeof dictionaries;

export function getDictionary(locale: string) {
  return dictionaries[(locale as Locale) in dictionaries ? (locale as Locale) : "en"];
}
