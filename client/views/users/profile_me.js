Template.profileMe.events({
  'submit [data-id=update-profile-form]': (event, template) => {
    event.preventDefault();
    
    var updatedValues = getUpdatedValues($(event.currentTarget));

    if (! updatedValues) {
      return;
    }

    Meteor.call('users.updateProfile', updatedValues, (error, result) => {
      if (error) {
        Bert.alert(error.reason, 'danger', 'growl-top-right');
      } else {
        Bert.alert('Profile successfully updated', 'success', 'growl-top-right');

        resetForm($('[data-id=update-profile-form]'));
      }
    });
  }
});