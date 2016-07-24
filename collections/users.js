/*
 * Email validation
   Use like this:
   
   check(email, ValidEmail);
 */
ValidEmail = Match.Where(function (x) {
  check(x, String);
  return x.length === 0 || (x.length <= 254 && ValidEmail.regex.test(x));
});

ValidEmail.regex = /^[A-Z0-9._%+\-]+@[A-Z0-9\.\-]+\.[A-Z]{2,}$/i;

/*
 * Phone validation
   Use like this:
   
   check(tel, ValidPhone);
 */
ValidPhone = Match.Where(function (x) {
  check(x, String);
  return x.length === 0 || (x.length <= 254 && ValidPhone.regex.test(x));
});

ValidPhone.regex = /^\s*(?:\+?(\d{1,3}))?[\-. (]*(\d{3})[\-. )]*(\d{3})[\-. ]*(\d{4})(?: *x(\d+))?\s*$/i;

/*
 * Url validation
   Use like this:
   
   check(url, ValidUrl);
 */
ValidUrl = Match.Where(function (x) {
  check(x, String);
  return x.length === 0 || (x.length <= 254 && ValidUrl.regex.test(x));
});

ValidUrl.regex = /^(https?:\/\/)?([\da-z\.\-]+)\.([a-z\.]{2,6})([\/\w \.\-]*)*\/?$/i;





/*
 * Loop through an array and return a values of a certain property in an array.
 */
function collectValues(array, propertyName) {
  var collection = [],
    i,
    l;

  for (i = 0, l = array.length; i < l; i += 1) {
    collection.push(array[i][propertyName]);
  }

  return collection;
}


Meteor.methods({
  'users.updateProfile': (user) => {
    check(user, {
      biography: Match.Optional(String),
      firstName: Match.Optional(String),
      lastName: Match.Optional(String)
    });

    if (!Meteor.user()) {
      throw new Meteor.Error(401, 'You need to be signed in to continue');
    }

    Meteor.users.update({
      _id: Meteor.userId()
    }, {
      $set: user
    });
  },

  'users.addRelation': (relation) => {
    var ownEmails,
      currentUser;

    currentUser = Meteor.user();

    if (!currentUser) {
      throw new Meteor.Error(401, 'You need to be signed in to continue');
    }

    check(relation, {
      email: ValidEmail,
      firstName: String,
      lastName: String,
      lastMeeting: Date,
      primaryPhone: ValidPhone,
      secondaryPhone: ValidPhone,
      facebook: ValidUrl,
      linkedin: ValidUrl,
      notes: String
    });

    ownEmails = collectValues(currentUser.emails, "address");
    if (ownEmails.indexOf(relation.email) !== -1) {
      throw new Meteor.Error(422, 'You can not add yourself');
    }

    // Allow every email address only once
    if (relation.email.length !== 0 && typeof currentUser.relations !== 'undefined' && collectValues(currentUser.relations, "email").indexOf(relation.email) !== -1) {
      throw new Meteor.Error(422, 'You added a relation with that email address already');
    }

    // Add unique ID to each relation
    relation._id = new Meteor.Collection.ObjectID().valueOf();
    relation.createdAt = new Date();

    Meteor.users.update({
      _id: Meteor.userId()
    }, {
      $addToSet: {
        relations: relation
      }
    });
  }

  //  'users.follow': (_id) => {
  //    check(_id, String);
  //
  //    if (!Meteor.user()) {
  //      throw new Meteor.Error(401, 'You need to be signed in to continue');
  //    }
  //    if (Meteor.userId() === _id) {
  //      throw new Meteor.Error(422, 'You can not follow yourself');
  //    }
  //
  //    Meteor.users.update({
  //      _id: Meteor.userId()
  //    }, {
  //      $addToSet: {
  //        followingIds: _id
  //      }
  //    });
  //  },
  //
  //  'users.unfollow': (_id) => {
  //    check(_id, String);
  //
  //    if (!Meteor.user()) {
  //      throw new Meteor.Error(401, 'You need to be signed in to continue');
  //    }
  //    if (Meteor.userId() === _id) {
  //      throw new Meteor.Error(422, 'You can not unfollow yourself');
  //    }
  //
  //    Meteor.users.update({
  //      _id: Meteor.userId()
  //    }, {
  //      $pull: {
  //        followingIds: _id
  //      }
  //    });
  //  }
});