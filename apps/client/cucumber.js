module.exports = {
  default: [
    '--require tests/acceptance/**/*.js',
    '--format @cucumber/pretty-formatter',
    '--publish-quiet',
    "--language 'pt'",
  ].join(' '),
};
