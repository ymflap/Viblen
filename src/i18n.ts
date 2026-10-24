export const supportedLanguages = ["ar", "en"] as const;

export type Language = (typeof supportedLanguages)[number];

type TranslationDictionary = {
  appName: string;
  appDescription: string;
  loading: string;
  languageName: string;
};

const translations: Record<Language, TranslationDictionary> = {
  ar: {
    appName: "ڤيبلن",
    appDescription: "منصة لإدارة الأعمال ونقاط البيع",
    loading: "جارٍ التحميل...",
    languageName: "العربية",
  },
  en: {
    appName: "Viblen",
    appDescription: "Business management and point-of-sale platform",
    loading: "Loading...",
    languageName: "English",
  },
};

export function detectBrowserLanguage(): Language {
  const browserLanguages =
    typeof navigator !== "undefined"
      ? navigator.languages?.length
        ? navigator.languages
        : [navigator.language]
      : [];

  for (const browserLanguage of browserLanguages) {
    const normalizedLanguage = browserLanguage
      .toLowerCase()
      .split("-")[0];

    if (
      supportedLanguages.includes(
        normalizedLanguage as Language,
      )
    ) {
      return normalizedLanguage as Language;
    }
  }

  return "ar";
}

export function getTranslations(
  language: Language,
): TranslationDictionary {
  return translations[language];
}

export function getTextDirection(
  language: Language,
): "rtl" | "ltr" {
  return language === "ar" ? "rtl" : "ltr";
}

export function applyLanguage(language: Language): void {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.lang = language;
  document.documentElement.dir = getTextDirection(language);
}
