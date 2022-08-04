import i18next from 'i18next';

import { TFunction } from './i18next-overrides';

// if no language parameter exists, let's try to use the node.js system's locale
const systemLocale = Intl.DateTimeFormat().resolvedOptions().locale;

i18next.init({
  resources: {
    en: {
      translation: require('./locales/en/common.json'),
    },
    pt: {
      translation: require('./locales/pt/common.json'),
    },
  },
});

export function i18n(lng?: string): TFunction {
  return i18next.getFixedT(lng || systemLocale);
}
