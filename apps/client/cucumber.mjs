const config = {
  requireModule: ['ts-node/register'],
  require: ['tests/acceptance/**/*.ts'],
  format: [
    'json:reports/cucumber-report.json',
    'html:reports/report.html',
    'summary',
    'progress-bar',
    '@cucumber/pretty-formatter',
  ],
  formatOptions: { snippetInterface: 'async-await' },
  publishQuiet: true,
  language: 'pt',
};

export default config;
