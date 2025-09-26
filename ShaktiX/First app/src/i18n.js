import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import hi from './locales/hi.json';
import bn from './locales/bn.json';
import te from './locales/te.json';

// Languages listed in the switcher
const languageCodes = [
  'en','hi','bn','te','mr','ta','ur','gu','kn','ml','pa','or','as','ks','sd','sa','ne','mai','doi','bho','gom','mni-Mtei','sat'
];

// Build resources: translations for available languages, English fallback for others
const resources = languageCodes.reduce((acc, code) => {
  if (code === 'en') acc[code] = { translation: en };
  else if (code === 'hi') acc[code] = { translation: hi };
  else if (code === 'bn') acc[code] = { translation: bn };
  else if (code === 'te') acc[code] = { translation: te };
  else acc[code] = { translation: en }; // fallback to English
  return acc;
}, {});

const stored = (() => { try { return localStorage.getItem('shaktix_lang') || 'en'; } catch (_) { return 'en'; } })();

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: stored,
    fallbackLng: 'en',
    supportedLngs: languageCodes,
    interpolation: { escapeValue: false }
  });

export default i18n;


