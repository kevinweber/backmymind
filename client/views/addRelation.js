Template.addRelation.onCreated(function () {
  this.searchQuery = new ReactiveVar('');
  this.filter = new ReactiveVar('all');
  this.limit = new ReactiveVar(20);
  this.postsCount = new ReactiveVar(0);

  this.autorun(() => {
    this.subscribe('posts.all', this.searchQuery.get(), this.filter.get(), this.limit.get());
    this.subscribe('users.all', this.searchQuery.get(), this.limit.get());
    this.postsCount.set(Counts.get('posts.all'));
  });
});

Template.addRelation.onRendered(() => {
  autosize($('[data-id=addEmail]'));

  // Set submit button to disabled since text field is empty
  $('input[type=submit]').addClass('disabled');
});

Template.addRelation.helpers({
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
  'keyup [data-id=addEmail]': (event, template) => {
    var $form = $('[data-id=add-relation]');

    // If addEmail section has text enable the submit button, else disable it
    if ($form.first()[0].checkValidity()) {
      $('input[type=submit]').removeClass('disabled');
    } else {
      $('input[type=submit]').addClass('disabled');
    }

    // When shift and enter are pressed, submit form
    if (event.shiftKey && event.keyCode === 13) {
      $form.submit();
    }
  },

  'change input, paste input': (event, template) => {
    $(event.target).addClass('populated');
  },

  'submit [data-id=add-relation]': (event, template) => {
    event.preventDefault();

    // Only continue if button isn't disabled
    if (!$('input[type=submit]').hasClass('disabled')) {
      let user = {};

      user.email = template.find('[data-id=addEmail]').value.toString();

      Meteor.call('users.addRelation', user, (error, result) => {
        if (error) {
          Bert.alert(error.reason, 'danger', 'growl-top-right');
        } else {
          Bert.alert('Relation successfully added', 'success', 'growl-top-right');
          template.find('[data-id=addEmail]').value = '';
        }
      });
    }
  }
});