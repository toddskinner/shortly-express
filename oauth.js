// OAuth 2.0

var passport = require('passport')
  , OAuth2Strategy = require('passport-oauth').OAuth2Strategy;

passport.use('provider', new OAuth2Strategy({
    authorizationURL: 'https://www.provider.com/oauth2/authorize',
    tokenURL: 'https://www.provider.com/oauth2/token',
    clientID: '123-456-789',
    clientSecret: 'shhh-its-a-secret',
    callbackURL: 'https://www.example.com/auth/provider/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    // refreshToken can be used to obtain new access tokens, and may be undefined if provider does not issue refresh tokens.
    // profile will contain user profile information provided by the service provider; refer to User Profile http://passportjs.org/guide/profile/
    User.findOrCreate(..., function(err, user) {
      done(err, user);
    });
  }
));

// Redirect the user to the OAuth 2.0 provider for authentication.  When
// complete, the provider will redirect the user back to the application at
//     /auth/provider/callback
app.get('/auth/provider', passport.authenticate('provider'));

// The OAuth 2.0 provider has redirected the user back to the application.
// Finish the authentication process by attempting to obtain an access
// token.  If authorization was granted, the user will be logged in.
// Otherwise, authentication has failed.
app.get('/auth/provider/callback',
  passport.authenticate('provider', { successRedirect: '/',
                                      failureRedirect: '/login' }));

// In OAuth 2.0, the scope of access is controlled by the scope option.
  // Multiple scopes can be specified as an array.
// app.get('/auth/provider',
//   passport.authenticate('provider', { scope: 'email' })
// );

// Values for the scope option are provider-specific. Consult the provider's documentation for details regarding supported scopes.
// app.get('/auth/provider',
//   passport.authenticate('provider', { scope: ['email', 'sms'] })
// );


// Link - A link or button can be placed on a web page, which will start the authentication process when clicked.
<a href="/auth/provider">Log In with OAuth 2.0 Provider</a>
