/*
 * Test if specific relation matches filter
 */
function isValidRelation(object, filter) {
  var filterableFields = ['email', 'firstName', 'lastName'];

  for (let i = 0, l = filterableFields.length; i < l; i += 1) {
    let field = object[filterableFields[i]];
    // We're using "toLowerCase()" to filter case-insensitive
    if (field && field.toLowerCase().indexOf(filter.toLowerCase()) !== -1) {
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

function Relation(props) {
  this.props = props;
}

var RelationHelper = {
  props: null,
  linkName: null,
  setLinkName: function () {
    var props = this.props,
      linkName;
    
    if (props.firstName && props.lastName) {
      linkName = props.firstName + ' ' + props.lastName;
    } else if ((props.firstName && !props.lastName) || (!props.firstName && props.lastName)) {
      linkName = props.firstName || props.lastName;
    } else {
      linkName = props.email;
    }
      
    this.linkName = linkName;
  },
  init: function (props) {
    this.props = props;

    this.setLinkName();
  }
}

function addRelationHelpers(relations) {
  for (let i = 0, l = relations.length; i < l; i += 1) {
    if (typeof relations[i].helper !== 'RelationHelper') {
      relations[i].helper = Object.create(RelationHelper);
    }
    
    relations[i].helper.init(relations[i]);
  }

  return relations;
}

Template.browseRelations.helpers({
  relations: () => {
    const instance = Template.instance();
    let filter = instance.searchQuery.get(),
      relations;

    check(filter, String);
    
    // If filter is given...
    if (filter) {
      relations = Meteor.users.findOne({
        _id: Meteor.userId()
      }, {
        fields: {
          "relations": 1
        }
      }).relations;

      relations = filterRelations(relations, filter);
    } else {
      // Default: Display all relations
      relations = Meteor.user() && Meteor.user().relations;
    }

    if (typeof relations !== 'undefined') {
      relations = addRelationHelpers(relations);
    }
    
    return relations;
  }
});

Template.browseRelations.onCreated(function () {
  this.searchQuery = new ReactiveVar('');
  
  Meteor.subscribe('user.relations');
});

Template.browseRelations.onRendered(function () {
  var $form = $('[data-id=search-users-form]');
  $form.find('input').not('[type=submit]').first().focus();
});