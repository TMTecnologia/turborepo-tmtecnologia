// eslint-disable-next-line @typescript-eslint/no-var-requires
const i18next = require('i18next');

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

module.exports = (lng) => {
  return i18next.getFixedT(lng || systemLocale);
};
