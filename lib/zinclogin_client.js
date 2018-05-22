ZincLogin.requestCredential = function(
  options,
  credentialRequestCompleteCallback
) {
  if (!credentialRequestCompleteCallback && typeof options === 'function') {
    credentialRequestCompleteCallback = options;
    options = {};
  }

  var config = ServiceConfiguration.configurations.findOne({
    service: 'battlenet',
  });

  if (!config) {
    credentialRequestCompleteCallback &&
      credentialRequestCompleteCallback(
        new ServiceConfiguration.ConfigError('Service not configured')
      );
    return;
  }

  var credentialToken = encodeURIComponent(Random.id());
  var loginStyle = OAuth._loginStyle('zinclogin', config, options);
  var scope = 'openid';

  var redirect_uri = `${req.protocol}://${req.get('host')}/login`;

  var loginUrl =
    'https://login.zinc.io/oidc/auth' +
    '?response_type=code' +
    '&client_id=' +
    config.clientId +
    '&redirect_uri=' +
    encodeURIComponent(Meteor.absoluteUrl('login')) +
    '&scope=' +
    scope +
    '&state=' +
    OAuth._stateParam(loginStyle, credentialToken);

  OAuth.initiateLogin(
    credentialToken,
    loginUrl,
    credentialRequestCompleteCallback
  );
};
