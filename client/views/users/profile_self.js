Template.self.events({
  'submit [data-id=update-profile-form]': (event, template) => {
    event.preventDefault();

    var updatedValues = {};

    // We're only interested in fields with changes values
    $(event.currentTarget).find('input.populated[data-id], textarea.populated[data-id]').each(function () {
      var $that = $(this);

      updatedValues[$that.attr('data-id')] = $that.val();
    });

    Meteor.call('users.updateProfile', updatedValues, (error, result) => {
      if (error) {
        Bert.alert(error.reason, 'danger', 'growl-top-right');
      } else {
        Bert.alert('Profile successfully updated', 'success', 'growl-top-right');
      }
    });
  }
});