getUpdatedValues = ($form) => {
  var updatedValues = {};

  // We're only interested in fields with changes values
  $form.find('input.populated[data-id], textarea.populated[data-id]').each(function () {
    var $that = $(this);

    updatedValues[$that.attr('data-id')] = $that.val();
  });

  if ($.isEmptyObject(updatedValues)) {
    return false; // Nothing has changed
  }
  
  return updatedValues;
}


resetForm = ($form) => {
  $form.find('.form-section.editable.active').each(function () {
    let $this = $(this);

    $this.find('input, textarea').attr('readonly', true);
    $this.removeClass('active');
  })

  $form.find('input[type=submit]').addClass('disabled');
}

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

currentProfile = () => {
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

Template.profile.helpers({
  user: function () {
    return Template.instance().user.get();
  }
});

Template.profile.onRendered(() => {
  autosize($('textarea'));
});

Template.profile.onCreated(function () {
  this.user = new ReactiveVar(currentProfile());
  
  this.limit = new ReactiveVar(20);
  //  this.userPostsCount = new ReactiveVar(0);

  this.autorun(() => {
    Meteor.subscribe('user.relations');
    this.subscribe('users.profile', FlowRouter.getParam('_id'), this.limit.get());
    //    this.userPostsCount.set(Counts.get('users.profile'));

    Template.instance().user.set(currentProfile());
    
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