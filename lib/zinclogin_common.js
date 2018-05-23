if (_.isUndefined(Zinclogin)) {
  Zinclogin = {};
}

Accounts.oauth.registerService('zinclogin');

if (Meteor.isClient) {
  Meteor.loginWithZinclogin = function(options, callback) {
    if (!callback && typeof options === 'function') {
      callback = options;
      options = null;
    }

    var credentialRequestCompleteCallback = Accounts.oauth.credentialRequestCompleteHandler(
      callback
    );
    Zinclogin.requestCredential(options, credentialRequestCompleteCallback);
  };
} else {
  Accounts.addAutopublishFields({
    forLoggedInUser: ['services.zinclogin'],
    forOtherUsers: [],
  });
}
