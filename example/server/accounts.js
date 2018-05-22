/**
 * For the purposes of quicker querying in the future,
 * whenever a user registers, their characters are added
 * to a collection for more easy maintenance
 */
Accounts.onCreateUser(function(options, user) {
  if (options.user) {
    console.log(options.user);
  }

  return user;
});
