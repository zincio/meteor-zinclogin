if (_.isUndefined(ZincLogin)) {
  ZincLogin = {};
}

Accounts.oauth.registerService('zinclogin');

if (Meteor.isClient) {
  Meteor.loginWithZincLogin = function(options, callback) {
    if (!callback && typeof options === 'function') {
      callback = options;
      options = null;
    }

    var credentialRequestCompleteCallback = Accounts.oauth.credentialRequestCompleteHandler(
      callback
    );
    ZincLogin.requestCredential(options, credentialRequestCompleteCallback);
  };
} else {
  Accounts.addAutopublishFields({
    forLoggedInUser: ['services.zinclogin'],
    forOtherUsers: [],
  });
}
