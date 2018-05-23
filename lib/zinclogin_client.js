Zinclogin.requestCredential = function(
  options,
  credentialRequestCompleteCallback
) {
  if (!credentialRequestCompleteCallback && typeof options === 'function') {
    credentialRequestCompleteCallback = options;
    options = {};
  }

  var config = ServiceConfiguration.configurations.findOne({
    service: 'zinclogin',
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

  var loginUrl =
    'https://login.zinc.io/oidc/auth' +
    '?response_type=code' +
    '&client_id=' +
    config.clientId +
    '&redirect_uri=' +
    OAuth._redirectUri('zinclogin', config) +
    //encodeURIComponent(Meteor.absoluteUrl('_oauth/zinclogin?close')) +
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
