Template.configureLoginServiceDialogForZinclogin.base_url = function() {
  return Meteor.absoluteUrl();
};

Template.configureLoginServiceDialogForZinclogin.fields = function() {
  return [
    { property: 'clientId', label: 'API Key' },
    { property: 'secret', label: 'Secret Key' },
  ];
};
