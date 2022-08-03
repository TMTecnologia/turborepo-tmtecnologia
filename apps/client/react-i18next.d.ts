import 'react-i18next';

import common from './public/locales/pt/common.json';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    resources: {
      common: typeof common;
    };
  }
}
