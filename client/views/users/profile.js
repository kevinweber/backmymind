enableFormSection = ($section) => {
  var $inputs = $section.find('[readonly]');

  if (!$section.hasClass('editable')) {
    return;
  }

  $section.addClass('active');
  $inputs.removeAttr('readonly');
  $inputs.first().select();
}

Template.profile.events({
  // Enable disabled textareas and input fields
  'click .form-section': (event, template) => {
    enableFormSection($(event.currentTarget));
  },

  // Also enable field when changing using tab key
  'focus textarea, focus input': (event, template) => {
    enableFormSection($(event.target).closest('.form-section'));
  },

  'keyup textarea, keyup input, paste textarea, paste input': (event, template) => {
    // Don't validate when pressing "tab"/"enter" key
    if (event.which === 9 || event.which === 13) { // "Tab" || "Enter"
      return;
    }

    var $form = $('[data-id=update-profile-form]');

    $(event.target).addClass('populated');

    window.requestAnimationFrame(function () {
      if ($form.first()[0].checkValidity()) {
        $('input[type=submit]').removeClass('disabled');
      } else {
        $('input[type=submit]').addClass('disabled');
      }
    });
  }
});

getUser = () => {
  var currentId = FlowRouter.getParam('_id'),
    user = Meteor.users.findOne({
      _id: currentId
    }),
    relation;

  if (user) {
    user.account = true;

    if (currentId === Meteor.userId()) {
      user.me = true;
      return user;
    }
  } else {
    user = {};
  }

  relation = Relations.findOne(currentId);

  if (typeof relation !== 'undefined') {
    user.relation = relation;
  } else if (!user.account) {
    user.none = true;
  }

  return user;
}

var throttleGetUser = _.throttle(getUser, 100);

Template.profile.helpers({
  user: throttleGetUser
});

Template.profile.onRendered(() => {
  autosize($('textarea'));
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