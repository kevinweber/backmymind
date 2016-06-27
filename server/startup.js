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

//  ServiceConfiguration.configurations.upsert({
//    service: "facebook"
//  }, {
//    $set: {
//      appId: Meteor.settings.private.facebook.appId,
//      secret: Meteor.settings.private.facebook.secret,
//      requestPermissions: ["user_friends"]
//    }
//  });

  Meteor.startup(function () {
    Meteor.Sendgrid.config({
      username: Meteor.settings.private.sendgrid.username,
      password: Meteor.settings.private.sendgrid.password
    });
  });

  //  Meteor.Sendgrid.send({
  //    to: 'whoItsTo@theDomain.com',
  //    from: 'no-reply@where-ever.com',
  //    subject: 'I really like sending emails with Sendgrid!',
  //    text: 'Sendgrid is totally awesome for sending emails!'
  //  });

});