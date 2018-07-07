Package.describe({
  name: 'dmihal:generator-method',
  version: '0.1.0',
  // Brief, one-line summary of the package.
  summary: 'Publish meteor methods that yield data',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.5');
  api.use('ecmascript');
  api.use('mongo');
  api.mainModule('client.js', 'client');
  api.mainModule('server.js', 'server');
});

Npm.depends({
  'babel-polyfill': '6.26.0',
});
