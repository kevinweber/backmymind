Template.browseRelations.events({
  'click [data-id=load-more]': (event, template) => {
    template.limit.set(template.limit.get() + 20);
  },

  'keyup [data-id=search-query]': _.debounce((event, template) => {
    event.preventDefault();
    template.searchQuery.set(template.find('[data-id=search-query]').value);
    template.limit.set(20);
  }, 300),

  'submit [data-id=search-users-form]': (event, template) => {
    event.preventDefault();
  }
});

Template.browseRelations.helpers({
  relations: () => {
    return Meteor.user() && Meteor.user().relations;
  },

  users: () => {
    return Meteor.users.find({ _id: { $ne: Meteor.userId() } }, { sort: { createdAt: -1 } });
  },

  hasMoreUsers: () => {
    return Template.instance().limit.get() <= Template.instance().usersCount.get();
  }
});

Template.browseRelations.onCreated(function() {
  this.searchQuery = new ReactiveVar('');
  this.limit = new ReactiveVar(20);
  this.usersCount = new ReactiveVar(0);

  this.autorun(() => {
    this.subscribe('users.all', this.searchQuery.get(), this.limit.get());
    this.usersCount.set(Counts.get('users.all'));
  });
});
