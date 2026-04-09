export const languages = {
  en: { name: 'English', dir: 'ltr' as const, font: 'inter', locale: 'en-US' },
  tr: { name: 'Türkçe', dir: 'ltr' as const, font: 'inter', locale: 'tr-TR' },
} as const;

export const defaultLang = 'en';
export type Lang = keyof typeof languages;

export function getI18nPaths() {
  return Object.keys(languages)
    .filter((lang) => lang !== defaultLang)
    .map((lang) => ({ params: { lang } }));
}
