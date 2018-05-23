/**
 * For the purposes of quicker querying in the future,
 * whenever a user registers, their characters are added
 * to a collection for more easy maintenance
 */
Accounts.onCreateUser(function(options, user) {
  if (options.zincUser) {
    user.zinc = Object.assign({}, options.zincUser);
    user._id = options.zincUser.sub;
  }

  // accessible here: 
  // services: { zinclogin: { ... } }
  
  return user;
});

ServiceConfiguration.configurations.remove({
  service: "zinclogin"
});

ServiceConfiguration.configurations.insert({
  service: "zinclogin",
  scope:'openid',
  clientId: "YOUR CLIENT ID HERE",
  secret: "YOUR SECRET HERE",
});
