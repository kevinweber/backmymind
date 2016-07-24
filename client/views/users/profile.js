Template.profile.events({
  'click [data-id=load-more]': (event, template) => {
    template.limit.set(template.limit.get() + 20);
  }
});




Template.profile.helpers({
  user: () => {
    var currentId = FlowRouter.getParam('_id'),
      user = Meteor.users.findOne({
        _id: currentId
      }) || {};

    if (currentId === Meteor.userId()) {
      user.self = true;
    } else {
      user.relation = Relations.findOne(currentId);
    }

    return user;
  }
});

Template.profile.onCreated(function () {
  this.limit = new ReactiveVar(20);
  //  this.userPostsCount = new ReactiveVar(0);

  this.autorun(() => {
    Meteor.subscribe('user.relations');
    this.subscribe('users.profile', FlowRouter.getParam('_id'), this.limit.get());
    //    this.userPostsCount.set(Counts.get('users.profile'));

    // Get current user's social media accounts
    let profileUser = Meteor.users.findOne({
      _id: FlowRouter.getParam('_id')
    });

    // Display social media links
    if (profileUser && profileUser.socialMedia) {
      $('#socialMediaAccounts').empty();
      for (var prop in profileUser.socialMedia) {
        let smLink = '<a id="' + prop + '" class="smAccount" href="' + profileUser.socialMedia[prop] + '"><img src="/img/' + prop + '.svg"/></a>';
        $(smLink).appendTo('#socialMediaAccounts');
      }
    }
  });
});