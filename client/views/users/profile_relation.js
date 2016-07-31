Template.profileRelation.events({
  'submit [data-id=update-profile-form]': (event, template) => {
    event.preventDefault();

    var updatedValues = getUpdatedValues($(event.currentTarget));

    if (!updatedValues) {
      return;
    }

    updatedValues.__index = Relations.findOne(FlowRouter.getParam('_id')).__index;

    Meteor.call('users.updateRelation', updatedValues, (error, result) => {
      if (error) {
        Bert.alert(error.reason, 'danger', 'growl-top-right');
      } else {
        Bert.alert('Relation successfully updated', 'success', 'growl-top-right');

        resetForm($('[data-id=update-profile-form]'));
      }
    });
  }
});