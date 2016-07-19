function setEmailValidationMessage(element) {
  if (element.type === 'email' && element.validity.patternMismatch) {
    element.setCustomValidity('Please enter valid email address');
  } else {
    element.setCustomValidity('');
  }
}

function submitForm() {
  var $form = $('[data-id=add-relation]');

  // Simulate click to trigger HTML5 form validation, and submit if form is valid
  $form.find('input[type=submit]').click();
}

//Template.addRelation.onCreated(function () {
//  this.searchQuery = new ReactiveVar('');
//  this.filter = new ReactiveVar('all');
//  this.limit = new ReactiveVar(20);
//  this.postsCount = new ReactiveVar(0);
//
//  this.autorun(() => {
////    this.subscribe('posts.all', this.searchQuery.get(), this.filter.get(), this.limit.get());
////    this.subscribe('users.all', this.searchQuery.get(), this.limit.get());
////    this.postsCount.set(Counts.get('posts.all'));
//  });
//});

Template.addRelation.onRendered(() => {
  var $form = $('[data-id=add-relation]'),
    $datepicker;
  
  $form.find('input').not('[type=submit]').first().focus();
  autosize($('textarea'));
  
  // Documentation: http://amsul.ca/pickadate.js/date/
  var $datepicker = $form.find('.datepicker');
  
  $datepicker.pickadate({
    // Note: The datepicker's value for the data-value attribute must match this format, otherwise it will always fall back to today's date
    formatSubmit: 'yyyy-mm-dd',
    min: new Date(1900,0,1),
    max: moment()
  });
  
  // Store default value so we can reset to it when form is reset
  $datepicker.attr('data-default-date', $datepicker.val());

  // Set submit button to disabled since text field is empty
  $form.find('input[type=submit]').addClass('disabled');
});

Template.addRelation.helpers({
  date: () => {
    this.yesterday = moment().subtract(1, 'day').format("YYYY-MM-DD");
    this.today = moment().format("YYYY-MM-DD");
    return this;
  },

  posts: () => {
    const instance = Template.instance();
    if (instance.searchQuery.get()) {
      return Posts.find({}, {
        sort: [['score', 'desc']]
      });
    }
    return Posts.find({}, {
      sort: {
        createdAt: -1
      }
    });
  },

  activeIfFilterIs: (filter) => {
    if (filter === Template.instance().filter.get()) {
      return 'active';
    }
  },

  hasMorePosts: () => {
    return Template.instance().limit.get() <= Template.instance().postsCount.get();
  },
  // Settings for autocomplete in post field
  settings: () => {
    return {
      position: 'bottom',
      limit: 5,
      rules: [{
        token: '@',
        collection: Meteor.users,
        field: 'username',
        template: Template.userList,
        filter: {
          _id: {
            $ne: Meteor.userId()
          }
        }
      }]
    };
  }
});

Template.addRelation.events({
  'keyup input[required]': (event, template) => {
    var $form = $('[data-id=add-relation]');

    window.requestAnimationFrame(function(){
      if ($form.first()[0].checkValidity()) {
        $('input[type=submit]').removeClass('disabled');
      } else {
        $('input[type=submit]').addClass('disabled');
      }
    });
  },

  'keydown input': (event, template) => {
    var $form = $('[data-id=add-relation]'),
      $inputs,
      currentIndex;
    
    if (!event.shiftKey && event.keyCode === 13) {
      event.preventDefault();
      
      $inputs = $form.find('input, textarea').not('[disabled], .disabled');
      currentIndex = $inputs.index(event.target);

      if (currentIndex + 1 === $inputs.length || $inputs.get(currentIndex + 1).type === 'submit') {
        submitForm();
      } else {
        $inputs.get(currentIndex + 1).focus();
      }
    }
  },

  'keydown input, keydown textarea': (event, template) => {
    var $form = $('[data-id=add-relation]');
    
    // When shift and enter are pressed, submit form
    if (event.shiftKey && event.keyCode === 13) {
      event.preventDefault();
      
      submitForm();
    }
  },

  'click input[type=submit]': (event, template) => {
    var $form = $('[data-id=add-relation]');

    $form.find('input').addClass('validate');
    //    setEmailValidationMessage(element);
  },

  'change input, paste input, blur input': (event, template) => {
    var element = event.target;

    $(element).addClass('populated');
    //    setEmailValidationMessage(element);
  },

  'keyup input[type=email]': (event, template) => {
    setEmailValidationMessage(event.target);
  },

  'submit [data-id=add-relation]': (event, template) => {
    event.preventDefault();

    // Only continue if button isn't disabled
    if (!$('input[type=submit]').hasClass('disabled')) {
      let user = {};

      user.email = template.find('[data-id=addEmail]').value.toString();
      user.firstName = template.find('[data-id=addFirstName]').value.toString();
      user.lastName = template.find('[data-id=addLastName]').value.toString();
      user.lastMeeting = new Date($(template.find('.datepicker ~ input[name=_submit]')).val());
      user.primaryPhone = template.find('[data-id=addPhonePrimary]').value.toString();
      user.secondaryPhone = template.find('[data-id=addPhoneSecondary]').value.toString();
      user.facebook = template.find('[data-id=addFacebook]').value.toString();
      user.linkedin = template.find('[data-id=addLinkedin]').value.toString();
      user.notes = template.find('[data-id=addNotes]').value.toString();
      user.avatar = getGravatar(user.email);

      Meteor.call('users.addRelation', user, (error, result) => {
        if (error) {
          Bert.alert(error.reason, 'danger', 'growl-top-right');
        } else {
          Bert.alert('Relation successfully added', 'success', 'growl-top-right');

          // Reset form
          var $form = $('[data-id=add-relation]'),
            $input = $form.find('input').not('[type=submit]'),
            $datepicker = $form.find('.datepicker');
          
          $form.find('input[type=submit]').addClass('disabled');
          $form.find('.validate').removeClass('validate');
          $form.find('.populated').removeClass('populated');
          $form.find('textarea').val('');
          $input.val('');
          $datepicker.val($datepicker.attr('data-default-date'));
          $input.first().focus();
        }
      });
    }
  }
});