publicAccessible = FlowRouter.group({});

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

signInRequired.route('/users/:_id', {
  name: 'profile',
  action: () => {
    BlazeLayout.render('layout', {
      main: 'profile'
    });
    setTitle('Profile');
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

signInRequired.route('/browse/facebook', {
  name: 'browseFacebook',
  action: () => {
    BlazeLayout.render('layout', {
      main: 'browseFacebook'
    });
    setTitle('Browse Facebook Friends');
  }
});

//signInRequired.route('/following', {
//  name: 'following',
//  action: () => {
//    BlazeLayout.render('layout', {
//      main: 'following'
//    });
//    setTitle('Following');
//  }
//});

signInRequired.route('/add', {
  name: 'addRelation',
  action: () => {
    BlazeLayout.render('layout', {
      main: 'addRelation'
    });
    setTitle('Add relation');
  }
});

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
//
//signInRequired.route('/jobBoard', {
//  name: 'jobBoard',
//  action: () => {
//    BlazeLayout.render('layout', {
//      main: 'jobBoard'
//    });
//    setTitle('Job board');
//  }
//});

/*
 * Redirects
 */
signInRequired.route('/browse', {
  action(params) {
    FlowRouter.go('browseRelations');
  }
});
