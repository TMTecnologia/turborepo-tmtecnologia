module.exports = {
  default: [
    '--require-module ts-node/register',
    '--require tests/acceptance/**/*.ts',
    '--format @cucumber/pretty-formatter',
    '--publish-quiet',
    "--language 'pt'",
  ].join(' '),
};
