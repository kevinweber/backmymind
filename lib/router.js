// Redirect to general error page
FlowRouter.notFound = {
  action: function () {
    FlowRouter.go('error');
  }
};

publicAccessible = FlowRouter.group({});

publicAccessible.route('/error', {
  name: 'error',
  action: () => {
    BlazeLayout.render('layout', {
      main: 'error'
    });
    setTitle('An error occurred');
  }
});

signInRequired = FlowRouter.group({
  triggersEnter: [AccountsTemplates.ensureSignedIn]
});

signInRequired.route('/', {
  name: 'home',
  action: () => {
    BlazeLayout.render('layout', {
      main: 'home'
    });
    setTitle('Home');
  }
});

signInRequired.route('/update-profile', {
  name: 'updateProfile',
  action: () => {
    BlazeLayout.render('layout', {
      main: 'updateProfile'
    });
    setTitle('Update profile');
  }
});

signInRequired.route('/browse/relations', {
  name: 'browseRelations',
  action: () => {
    BlazeLayout.render('layout', {
      main: 'browseRelations'
    });
    setTitle('Browse Relations');
  }
});

signInRequired.route('/add/relation', {
  name: 'addRelation',
  action: () => {
    BlazeLayout.render('layout', {
      main: 'addRelation'
    });
    setTitle('Add relation');
  }
});

/*
 * Redirects
 */
signInRequired.route('/browse', {
  action() {
    FlowRouter.go('browseRelations');
  }
});
signInRequired.route('/add', {
  action() {
    FlowRouter.go('addRelation');
  }
});

/*
 * NOTE: Make sure that this route is set up AFTER redirects.
 * Otherwise redirects won't work.
 */
signInRequired.route('/:_id', {
  name: 'profile',
  action: (params) => {
    BlazeLayout.render('layout', {
      main: 'profile'
    });
    setTitle('Profile');
  }
});


//signInRequired.route('/users/:_id', {
//  name: 'profile',
//  action: () => {
//    BlazeLayout.render('layout', {
//      main: 'profile'
//    });
//    setTitle('Profile');
//  }
//});

//signInRequired.route('/following', {
//  name: 'following',
//  action: () => {
//    BlazeLayout.render('layout', {
//      main: 'following'
//    });
//    setTitle('Following');
//  }
//});

//signInRequired.route('/follower', {
//  name: 'follower',
//  action: () => {
//    BlazeLayout.render('layout', {
//      main: 'follower'
//    });
//    setTitle('Follower');
//  }
//});
//
//signInRequired.route('/messages', {
//  name: 'messages',
//  action: () => {
//    BlazeLayout.render('layout', {
//      main: 'messages'
//    });
//    setTitle('Messages');
//  }
//});