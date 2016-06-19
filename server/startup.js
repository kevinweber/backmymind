Meteor.startup(() => {
  Accounts.validateNewUser((user) => {
    if (user.emails && user.emails[0].address.length !== 0) {
      return true;
    }
    throw new Meteor.Error(403, 'E-Mail address should not be blank');
  });
  Accounts.validateNewUser((user) => {
    if (user.username && user.username.length >= 3) {
      return true;
    }
    throw new Meteor.Error(403, 'Username must have at least 3 characters');
  });

  ////    Twitter login not working (unless we don't require email address for login) because the Twitter API is not providing an email address, see https://atmospherejs.com/splendido/accounts-meld
  //    ServiceConfiguration.configurations.upsert({
  //      service: "twitter"
  //    }, {
  //      $set: {
  //        consumerKey: "rPIHoirPPpjoVuI45VaHsDFVS",
  //        secret: "4FOJQjA4hZ8Z8bKduulHoW2LwiTmiB3TJM8wcyQz9I6wBuwEoS"
  //      }
  //    });
});