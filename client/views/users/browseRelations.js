/*
 * Test if specific relation matches filter
 */
function isValidRelation(object, filter) {
  var filterableFields = ['email', 'firstName', 'lastName'];

  for (let i = 0, l = filterableFields.length; i < l; i += 1) {
    let field = object[filterableFields[i]];
    if (field && field.indexOf(filter) !== -1) {
      return true;
    }
  }

  return false;
}

/*
 * Filter an object with relations,
 * and only return relations matching the filter
 */
function filterRelations(object, filter) {
  var filtered = [];

  for (let relation in object) {
    if (object.hasOwnProperty(relation)) {
      if (isValidRelation(object[relation], filter)) {
        filtered.push(object[relation]);
      }
    }
  }

  return filtered;
}


Template.browseRelations.events({
  'keyup [data-id=search-query]': _.debounce((event, template) => {
    event.preventDefault();
    template.searchQuery.set(template.find('[data-id=search-query]').value);
  }, 300)
});

Template.browseRelations.helpers({
  relations: () => {
    const instance = Template.instance();
    let filter = instance.searchQuery.get();

    // If filter is given...
    if (filter) {
      let relations = Meteor.users.findOne({
        _id: Meteor.userId()
      }, {
        fields: {
          "relations": 1
        }
      }).relations;

      relations = filterRelations(relations, filter);

      return relations;
    }

    // Default: Display all relations
    return Meteor.user() && Meteor.user().relations;
  }
});

Template.browseRelations.onCreated(function () {
  this.searchQuery = new ReactiveVar('');
  
  Meteor.subscribe('user.relations');
});