var OAuth = Package.oauth.OAuth;
var urlUtil = Npm.require('url');

// data retrieved

var getUserInfo = function(accessToken) {
  try {
    return Meteor.http.get('https://login.zinc.io/oidc/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }).data;
  } catch (err) {
    throw new Error('Failed to fetch Zinc Login identity' + err.message);
  }
};

OAuth.registerService('zinclogin', 2, null, function(query) {
  var response = getTokenResponse(query);
  var accessToken = response.accessToken;
  var userInfo = getUserInfo(accessToken);

  var serviceData = {
    id: Random.id(),
    accessToken: accessToken,
    expiresAt: +new Date() + 1000 * response.expiresIn,
  };

  return {
    serviceData: serviceData,
    options: {
      user: userInfo,
    },
  };
});

var isJSON = function(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

var getTokenResponse = function(query) {
  // service-configuration supplies secret key for zinclogin
  var config = ServiceConfiguration.configurations.findOne({
    service: 'zinclogin',
  });

  if (!config)
    throw new ServiceConfiguration.ConfigError('Service not configured');

  var responseContent;
  try {
    responseContent = Meteor.http.post(
      'https://login.zinc.io/oidc/token' +
        '&code=' +
        query.code +
        '&client_id=' +
        config.clientId +
        '&client_secret=' +
        OAuth.openSecret(config.secret) +
        '&redirect_uri=' +
        encodeURIComponent(Meteor.absoluteUrl('login'))
    ).content;
  } catch (err) {
    throw new Error('Failed to complete OAuth handshake\n\n' + err.message);
  }

  if (!isJSON(responseContent)) {
    throw new Error('Failed to complete OAuth handshake' + responseContent);
  }

  var parsedResponse = JSON.parse(responseContent);
  var accessToken = parsedResponse.access_token;
  var expiresIn = parsedResponse.expires_in;

  if (!accessToken) {
    throw new Error(
      'Failed to complete OAuth handshake\n\
      did not receive an oauth token.\n' +
        responseContent
    );
  }

  return {
    accessToken: accessToken,
    expiresIn: expiresIn,
  };
};

ZincLogin.retrieveCredential = function(credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};
