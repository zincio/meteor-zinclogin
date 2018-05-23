import { HTTP } from 'meteor/http';
var OAuth = Package.oauth.OAuth;
var urlUtil = Npm.require('url');

// data retrieved
var getUserInfo = function(accessToken) {
  try {
    return HTTP.get('https://login.zinc.io/oidc/userinfo', {
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/json',
        Accept: 'application/json',
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
  var serviceData = Object.assign(
    {
      accessToken: OAuth.sealSecret(accessToken),
      id: userInfo.sub,
    },
    userInfo
  );

  console.log(serviceData);
  return {
    serviceData: serviceData,
    options: {
      zincUser: userInfo,
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
    responseContent = HTTP.post('https://login.zinc.io/oidc/token', {
      data: {
        code: query.code,
        client_id: config.clientId,
        client_secret: OAuth.openSecret(config.secret),
        redirect_uri: OAuth._redirectUri('zinclogin', config),
        grant_type: 'authorization_code',
      },
    }).content;
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

Zinclogin.retrieveCredential = function(credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};
