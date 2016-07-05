/*
 * Email validation
   Use like this:
   
   check(email, ValidEmail);
 */
ValidEmail = Match.Where(function (x) {
  check(x, String);
  return x.length <= 254 && ValidEmail.regex.test(x);
});

ValidEmail.regex = /^[A-Z0-9._%+\-]+@[A-Z0-9\.\-]+\.[A-Z]{2,}$/i;


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
      biography: String,
      socialMedia: Object
    });

    if (!Meteor.user()) {
      throw new Meteor.Error(401, 'You need to be signed in to continue');
    }

    Meteor.users.update({
      _id: Meteor.userId()
    }, {
      $set: {
        biography: user.biography,
        socialMedia: user.socialMedia
      }
    });
  },

  'users.addRelation': (user) => {
    var ownEmails,
      currentUser;

    currentUser = Meteor.user();

    if (!currentUser) {
      throw new Meteor.Error(401, 'You need to be signed in to continue');
    }

    check(user, {
      email: ValidEmail,
      firstName: String,
      lastName: String,
      avatar: String
    });

    ownEmails = collectValues(currentUser.emails, "address");
    if (ownEmails.indexOf(user.email) !== -1) {
      throw new Meteor.Error(422, 'You can not add yourself');
    }

    // Allow every email address only once
    if (typeof currentUser.relations !== 'undefined' && collectValues(currentUser.relations, "email").indexOf(user.email) !== -1) {
      throw new Meteor.Error(422, 'You added that relation already');
    }

    Meteor.users.update({
      _id: Meteor.userId()
    }, {
      $addToSet: {
        relations: user
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