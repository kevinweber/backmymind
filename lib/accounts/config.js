// Documentation: https://github.com/meteor-useraccounts/core/blob/master/Guide.md
AccountsTemplates.configure({
  defaultLayout: 'layout',
  defaultLayoutRegions: {
    header: 'header',
    footer: '_footeyr'
  },
  defaultContentRegion: 'main',
  showForgotPasswordLink: true,
  overrideLoginErrors: true,
  enablePasswordChange: true,
  sendVerificationEmail: true,

  enforceEmailVerification: true,
  confirmPassword: true,
  continuousValidation: true,
  // displayFormLabels: true,
  // forbidClientAccountCreation: false,
  homeRoutePath: '/',
  showAddRemoveServices: true,
  showPlaceholders: true,

  negativeValidation: true,
  positiveValidation: true,
  negativeFeedback: false,
  positiveFeedback: false,

  privacyUrl: 'privacy',
  termsUrl: 'terms',

  texts: {
    title: {
      changePwd: 'Change password',
      forgotPwd: 'Forgot password?',
      resetPwd: 'Reset password',
      signIn: 'Sign in',
      signUp: 'Sign up',
      verifyEmail: 'Verify Email'
    },
    button: {
      changePwd: 'Change password',
      enrollAccount: 'Enroll Text',
      forgotPwd: 'Send reset link',
      resetPwd: 'Reset Password',
      signIn: 'Sign in',
      signUp: 'Sign up'
    }
  }
});

AccountsTemplates.removeField('email');
AccountsTemplates.addFields([
  {
    _id: 'email',
    type: 'email',
    required: true,
    displayName: 'Email',
    re: /.+@(.+){2,}\.(.+){2,}/,
    errStr: 'Invalid email'
  },
  AccountsTemplates.removeField('password')
]);


// enable preconfigured Flow-Router routes by useraccounts:flow-router.
AccountsTemplates.configureRoute('changePwd');
AccountsTemplates.configureRoute('forgotPwd');
AccountsTemplates.configureRoute('resetPwd');
AccountsTemplates.configureRoute('signIn');
AccountsTemplates.configureRoute('signUp');
AccountsTemplates.configureRoute('verifyEmail');
// AccountsTemplates.configureRoute('enrollAccount'); // for creating passwords after logging first time
