"use strict";

var _passport = _interopRequireDefault(require("passport"));

var _passportGithub = _interopRequireDefault(require("passport-github"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _path = _interopRequireDefault(require("path"));

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//////////////////////////////////////////////////////////////////////////
//IMPORTS AND VARIABLE INITIALIZATIONS
//The following code imports necessary dependencies and initializes
//variables used in the server middleware.
//////////////////////////////////////////////////////////////////////////
var LOCAL_PORT = 8081;
var DEPLOY_URL = "http://localhost:" + LOCAL_PORT;
var PORT = process.env.HTTP_PORT || LOCAL_PORT;
var GithubStrategy = _passportGithub["default"].Strategy;
var app = (0, _express["default"])(); //////////////////////////////////////////////////////////////////////////
//PASSPORT SET-UP
//The following code sets up the app with OAuth authentication using
//the 'github' strategy in passport.js.
//////////////////////////////////////////////////////////////////////////

_passport["default"].use(new GithubStrategy({
  clientID: "a075012c4b08543f42a8",
  clientSecret: "8dde6978090028aee37c72df9ea7ce268678b6d3",
  callbackURL: DEPLOY_URL + "/auth/github/callback"
}, function (accessToken, refreshToken, profile, done) {
  // TO DO: If user in profile object isn’t yet in our database, add the user here
  return done(null, profile);
}));

_passport["default"].serializeUser(function (user, done) {
  console.log("In serializeUser."); //Note: The code does not use a back-end database. When we have back-end 
  //database, we would put user info into the database in the callback 
  //above and only serialize the unique user id into the session

  var userObject = {
    id: user.username + "@github",
    username: user.username,
    provider: user.provider,
    profileImageUrl: user.photos[0].value
  };
  done(null, userObject);
}); //Deserialize the current user from the session
//to persistent storage.


_passport["default"].deserializeUser(function (user, done) {
  console.log("In deserializeUser."); //TO DO: Look up the user in the database and attach their data record to
  //req.user. For the purposes of this demo, the user record received as a param 
  //is just being passed through, without any database lookup.

  done(null, user);
}); //////////////////////////////////////////////////////////////////////////
//INITIALIZE EXPRESS APP
// The following code uses express.static to serve the React app defined 
//in the client/ directory at PORT. It also writes an express session
//to a cookie, and initializes a passport object to support OAuth.
/////////////////////////////////////////////////////////////////////////


app.use((0, _expressSession["default"])({
  secret: "speedgolf",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60
  }
})).use(_express["default"]["static"](_path["default"].join(__dirname, "client/build"))).use(_passport["default"].initialize()).use(_passport["default"].session()).listen(PORT, function () {
  return console.log("Listening on ".concat(PORT));
}); //////////////////////////////////////////////////////////////////////////
//DEFINE EXPRESS APP ROUTES
//////////////////////////////////////////////////////////////////////////
//AUTHENTICATE route: Uses passport to authenticate with GitHub.
//Should be accessed when user clicks on 'Login with GitHub' button on 
//Log In page.

app.get('/auth/github', _passport["default"].authenticate('github')); //CALLBACK route:  GitHub will call this route after the
//OAuth authentication process is complete.
//req.isAuthenticated() tells us whether authentication was successful.

app.get('/auth/github/callback', _passport["default"].authenticate('github', {
  failureRedirect: '/'
}), function (req, res) {
  console.log("auth/github/callback reached.");
  res.redirect('/'); //sends user back to login screen; 
  //req.isAuthenticated() indicates status
}); //LOGOUT route: Use passport's req.logout() method to log the user out and
//redirect the user to the main app page. req.isAuthenticated() is toggled to false.

app.get('/auth/logout', function (req, res) {
  console.log('/auth/logout reached. Logging out');
  req.logout();
  res.redirect('/');
}); //TEST route: Tests whether user was successfully authenticated.
//Should be called from the React.js client to set up app state.

app.get('/auth/test', function (req, res) {
  console.log("auth/test reached.");
  var isAuth = req.isAuthenticated();

  if (isAuth) {
    console.log("User is authenticated");
    console.log("User record tied to session: " + JSON.stringify(req.user));
  } else {
    //User is not authenticated
    console.log("User is not authenticated");
  } //Return JSON object to client with results.


  res.json({
    isAuthenticated: isAuth,
    user: req.user
  });
});
