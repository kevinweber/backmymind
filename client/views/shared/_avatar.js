/*
 * Deal with avatars.
 * Default images are generated using https://robohash.org/
 */
Avatars = {
  href: function (data) {
    var hash = data.id,
      size = data.size + "x" + data.size;

    // If email is provided, use it
    if (data.email) {
      hash = encode(data.email);
    // If hash equals current user's ID, use his email address
    } else if (hash === Meteor.userId()) {
      hash = encode(Meteor.user().emails[0].address);
    } else {
      // TODO: Instead of requesting a Robohash avatar for every hash, only request it if an email address is provided. Otherwise fall back to a local set of images in order to have less requests, better performance, and finally a better UX.
    }

    return "//robohash.org/" + hash + "?gravatar=hashed&size=" + size; // ?gravatar=yes&
  }
}

/*
 * Avatar helper.
 * Default avatar size: 30px
 */
UI.registerHelper("avatar", function (id, options) {
  return Avatars.href({
    id: id,
    size: options.hash.size || 30,
    email: options.hash.email
  });
});