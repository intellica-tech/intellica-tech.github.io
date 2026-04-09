import { languages, defaultLang, type Lang } from './config';

import en from './locales/en.json';
import tr from './locales/tr.json';

const translations: Record<Lang, Record<string, string>> = { en, tr };

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang in languages) return lang as Lang;
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: string): string {
    return translations[lang]?.[key]
      ?? translations[defaultLang]?.[key]
      ?? key;
  };
}

export function useTranslatedPath(lang: Lang) {
  return function translatePath(path: string): string {
    return lang === defaultLang ? path : `/${lang}${path}`;
  };
}
