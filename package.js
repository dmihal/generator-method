Package.describe({
  name: 'dmihal:generator-method',
  version: '0.1.5',
  summary: 'Publish meteor methods that yield data',
  git: 'https://github.com/dmihal/generator-method',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.5');
  api.use('ecmascript');
  api.use('mongo');
  api.use('check', 'server');
  api.mainModule('client.js', 'client');
  api.mainModule('server.js', 'server');
});
