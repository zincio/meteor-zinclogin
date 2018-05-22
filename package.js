Package.describe({
  name: 'zincio:meteor-zinclogin',
  summary: 'OAuth authentication with zinc login',
  documentation: 'README.md',
  version: '0.0.1',
  git: 'https://github.com/',
});

Package.onUse(function(api) {
  // api.versionsFrom('METEOR@1.1.1');
  api.use('accounts-base', ['client', 'server']);
  api.use('accounts-oauth', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('oauth2', ['client', 'server']);
  api.use('http', ['client', 'server']);
  api.use('service-configuration', ['client', 'server']);
  api.use('underscore', ['client', 'server']);
  api.use(['random', 'templating@1.0.11'], 'client');

  api.addFiles(
    ['lib/zinclogin_configure.html', 'lib/zinclogin_configure.js'],
    'client'
  );
  api.addFiles('lib/zinclogin_common.js', ['client', 'server']);
  api.addFiles('lib/zinclogin_server.js', 'server');
  api.addFiles('lib/zinclogin_client.js', 'client');
});
