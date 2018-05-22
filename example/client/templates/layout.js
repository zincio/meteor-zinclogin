AccountsTemplates.configure({
  hideSignUpLink: true,
});

AccountsTemplates.configureRoute('signIn', {
  redirect: function() {
    var user = Meteor.user();
    if (user) {
      Router.go('Info');
    }
  },
});
