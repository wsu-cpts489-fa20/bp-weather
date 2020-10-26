"use strict";

var _passport = _interopRequireDefault(require("passport"));

var _passportGithub = _interopRequireDefault(require("passport-github"));

var _passportLocal = _interopRequireDefault(require("passport-local"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _regeneratorRuntime = _interopRequireDefault(require("regenerator-runtime"));

var _path = _interopRequireDefault(require("path"));

var _express = _interopRequireDefault(require("express"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _console = require("console");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var LOCAL_PORT = 8081;
var DEPLOY_URL = "http://localhost:8081";
var PORT = process.env.HTTP_PORT || LOCAL_PORT;
var GithubStrategy = _passportGithub["default"].Strategy;
var LocalStrategy = _passportLocal["default"].Strategy;
var app = (0, _express["default"])(); //////////////////////////////////////////////////////////////////////////
//MONGOOSE SET-UP
//The following code sets up the app to connect to a MongoDB database
//using the mongoose library.
//////////////////////////////////////////////////////////////////////////

var connectStr = 'mongodb://localhost:27017/appdb';

_mongoose["default"].connect(connectStr, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(function () {
  console.log("Connected to ".concat(connectStr, "."));
}, function (err) {
  console.error("Error connecting to ".concat(connectStr, ": ").concat(err));
});

var Schema = _mongoose["default"].Schema;
var roundSchema = new Schema({
  date: {
    type: Date,
    required: true
  },
  course: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    "enum": ['practice', 'tournament']
  },
  holes: {
    type: Number,
    required: true,
    min: 1,
    max: 18
  },
  strokes: {
    type: Number,
    required: true,
    min: 1,
    max: 300
  },
  minutes: {
    type: Number,
    required: true,
    min: 1,
    max: 240
  },
  seconds: {
    type: Number,
    required: true,
    min: 0,
    max: 60
  },
  notes: {
    type: String,
    required: true
  }
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});
roundSchema.virtual('SGS').get(function () {
  return this.strokes * 60 + this.minutes * 60 + this.seconds;
}); //Define schema that maps to a document in the Users collection in the appdb
//database.

var userSchema = new Schema({
  id: String,
  //unique identifier for user
  password: String,
  displayName: String,
  //Name to be displayed within app
  authStrategy: String,
  //strategy used to authenticate, e.g., github, local
  profilePicURL: String,
  //link to profile image
  securityQuestion: String,
  securityAnswer: {
    type: String,
    required: function required() {
      return this.securityQuestion ? true : false;
    }
  },
  rounds: [roundSchema]
});

var User = _mongoose["default"].model("User", userSchema); //////////////////////////////////////////////////////////////////////////
//PASSPORT SET-UP
//The following code sets up the app with OAuth authentication using
//the 'github' strategy in passport.js.
//////////////////////////////////////////////////////////////////////////


_passport["default"].use(new GithubStrategy({
  clientID: "a075012c4b08543f42a8",
  clientSecret: "8dde6978090028aee37c72df9ea7ce268678b6d3",
  callbackURL: DEPLOY_URL + "/auth/github/callback"
},
/*#__PURE__*/
//The following function is called after user authenticates with github
function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime["default"].mark(function _callee(accessToken, refreshToken, profile, done) {
    var userId, currentUser;
    return _regeneratorRuntime["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log("User authenticated through GitHub! In passport callback."); //Our convention is to build userId from displayName and provider

            userId = "".concat(profile.username, "@").concat(profile.provider); //See if document with this unique userId exists in database 

            _context.next = 4;
            return User.findOne({
              id: userId
            });

          case 4:
            currentUser = _context.sent;

            if (currentUser) {
              _context.next = 9;
              break;
            }

            _context.next = 8;
            return new User({
              id: userId,
              displayName: profile.displayName,
              authStrategy: profile.provider,
              profilePicURL: profile.photos[0].value,
              rounds: []
            }).save();

          case 8:
            currentUser = _context.sent;

          case 9:
            return _context.abrupt("return", done(null, currentUser));

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}()));

_passport["default"].use(new LocalStrategy({
  passReqToCallback: true
},
/*#__PURE__*/
//Called when user is attempting to log in with local username and password. 
//userId contains the email address entered into the form and password
//contains the password entered into the form.
function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime["default"].mark(function _callee2(req, userId, password, done) {
    var thisUser;
    return _regeneratorRuntime["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return User.findOne({
              id: userId
            });

          case 3:
            thisUser = _context2.sent;

            if (!thisUser) {
              _context2.next = 13;
              break;
            }

            if (!(thisUser.password === password)) {
              _context2.next = 9;
              break;
            }

            return _context2.abrupt("return", done(null, thisUser));

          case 9:
            req.authError = "The password is incorrect. Please try again" + " or reset your password.";
            return _context2.abrupt("return", done(null, false));

          case 11:
            _context2.next = 15;
            break;

          case 13:
            //userId not found in DB
            req.authError = "There is no account with email " + userId + ". Please try again.";
            return _context2.abrupt("return", done(null, false));

          case 15:
            _context2.next = 20;
            break;

          case 17:
            _context2.prev = 17;
            _context2.t0 = _context2["catch"](0);
            return _context2.abrupt("return", done(_context2.t0));

          case 20:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 17]]);
  }));

  return function (_x5, _x6, _x7, _x8) {
    return _ref2.apply(this, arguments);
  };
}())); //Serialize the current user to the session


_passport["default"].serializeUser(function (user, done) {
  console.log("In serializeUser.");
  console.log("Contents of user param: " + JSON.stringify(user));
  done(null, user.id);
}); //Deserialize the current user from the session
//to persistent storage.


_passport["default"].deserializeUser( /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime["default"].mark(function _callee3(userId, done) {
    var thisUser;
    return _regeneratorRuntime["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            console.log("In deserializeUser.");
            console.log("Contents of userId param: " + userId);
            _context3.prev = 2;
            _context3.next = 5;
            return User.findOne({
              id: userId
            });

          case 5:
            thisUser = _context3.sent;
            console.log("User with id " + userId + " found in DB. User object will be available in server routes as req.user.");
            done(null, thisUser);
            _context3.next = 13;
            break;

          case 10:
            _context3.prev = 10;
            _context3.t0 = _context3["catch"](2);
            done(_context3.t0);

          case 13:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[2, 10]]);
  }));

  return function (_x9, _x10) {
    return _ref3.apply(this, arguments);
  };
}()); //////////////////////////////////////////////////////////////////////////
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
})).use(_express["default"]["static"](_path["default"].join(__dirname, "client/build"))).use(_passport["default"].initialize()).use(_passport["default"].session()).use(_express["default"].json({
  limit: '20mb'
})).listen(PORT, function () {
  return console.log("Listening on ".concat(PORT));
}); //////////////////////////////////////////////////////////////////////////
//DEFINE EXPRESS APP ROUTES
//////////////////////////////////////////////////////////////////////////
/////////////////////////
//AUTHENTICATION ROUTES
/////////////////////////
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
}); //LOGIN route: Attempts to log in user using local strategy

app.post('/auth/login', _passport["default"].authenticate('local', {
  failWithError: true
}), function (req, res) {
  console.log("/login route reached: successful authentication."); //Redirect to app's main page; the /auth/test route should return true

  res.status(200).send("Login successful");
}, function (err, req, res, next) {
  console.log("/login route reached: unsuccessful authentication");

  if (req.authError) {
    console.log("req.authError: " + req.authError);
    res.status(401).send(req.authError);
  } else {
    res.status(401).send("Unexpected error occurred when attempting to authenticate. Please try again.");
  } //Note: Do NOT redirect! Client will take over.

}); /////////////////////////////////
//USER ACCOUNT MANAGEMENT ROUTES
////////////////////////////////
//READ user route: Retrieves the user with the specified userId from users collection (GET)

app.get('/users/:userId', /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime["default"].mark(function _callee4(req, res, next) {
    var thisUser;
    return _regeneratorRuntime["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            console.log("in /users route (GET) with userId = " + JSON.stringify(req.params.userId));
            _context4.prev = 1;
            _context4.next = 4;
            return User.findOne({
              id: req.params.userId
            });

          case 4:
            thisUser = _context4.sent;

            if (thisUser) {
              _context4.next = 9;
              break;
            }

            return _context4.abrupt("return", res.status(404).send("No user account with id " + req.params.userId + " was found in database."));

          case 9:
            return _context4.abrupt("return", res.status(200).json(JSON.stringify(thisUser)));

          case 10:
            _context4.next = 16;
            break;

          case 12:
            _context4.prev = 12;
            _context4.t0 = _context4["catch"](1);
            console.log();
            return _context4.abrupt("return", res.status(400).send("Unexpected error occurred when looking up user with id " + req.params.userId + " in database: " + _context4.t0));

          case 16:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[1, 12]]);
  }));

  return function (_x11, _x12, _x13) {
    return _ref4.apply(this, arguments);
  };
}()); //CREATE user route: Adds a new user account to the users collection (POST)

app.post('/users/:userId', /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime["default"].mark(function _callee5(req, res, next) {
    var thisUser;
    return _regeneratorRuntime["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            console.log("in /users route (POST) with params = " + JSON.stringify(req.params) + " and body = " + JSON.stringify(req.body));

            if (!(req.body === undefined || !req.body.hasOwnProperty("password") || !req.body.hasOwnProperty("displayName") || !req.body.hasOwnProperty("profilePicURL") || !req.body.hasOwnProperty("securityQuestion") || !req.body.hasOwnProperty("securityAnswer"))) {
              _context5.next = 3;
              break;
            }

            return _context5.abrupt("return", res.status(400).send("/users POST request formulated incorrectly. " + "It must contain 'password','displayName','profilePicURL','securityQuestion' and 'securityAnswer fields in message body."));

          case 3:
            _context5.prev = 3;
            _context5.next = 6;
            return User.findOne({
              id: req.params.userId
            });

          case 6:
            thisUser = _context5.sent;

            if (!thisUser) {
              _context5.next = 11;
              break;
            }

            //account already exists
            res.status(400).send("There is already an account with email '" + req.params.userId + "'.");
            _context5.next = 15;
            break;

          case 11:
            _context5.next = 13;
            return new User({
              id: req.params.userId,
              password: req.body.password,
              displayName: req.body.displayName,
              authStrategy: 'local',
              profilePicURL: req.body.profilePicURL,
              securityQuestion: req.body.securityQuestion,
              securityAnswer: req.body.securityAnswer,
              rounds: []
            }).save();

          case 13:
            thisUser = _context5.sent;
            return _context5.abrupt("return", res.status(201).send("New account for '" + req.params.userId + "' successfully created."));

          case 15:
            _context5.next = 20;
            break;

          case 17:
            _context5.prev = 17;
            _context5.t0 = _context5["catch"](3);
            return _context5.abrupt("return", res.status(400).send("Unexpected error occurred when adding or looking up user in database. " + _context5.t0));

          case 20:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[3, 17]]);
  }));

  return function (_x14, _x15, _x16) {
    return _ref5.apply(this, arguments);
  };
}()); //UPDATE user route: Updates a new user account in the users collection (POST)

app.put('/users/:userId', /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime["default"].mark(function _callee6(req, res, next) {
    var validProps, bodyProp, status;
    return _regeneratorRuntime["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            console.log("in /users update route (PUT) with userId = " + JSON.stringify(req.params) + " and body = " + JSON.stringify(req.body));

            if (req.params.hasOwnProperty("userId")) {
              _context6.next = 3;
              break;
            }

            return _context6.abrupt("return", res.status(400).send("users/ PUT request formulated incorrectly." + "It must contain 'userId' as parameter."));

          case 3:
            validProps = ['password', 'displayName', 'profilePicURL', 'securityQuestion', 'securityAnswer'];
            _context6.t0 = _regeneratorRuntime["default"].keys(req.body);

          case 5:
            if ((_context6.t1 = _context6.t0()).done) {
              _context6.next = 11;
              break;
            }

            bodyProp = _context6.t1.value;

            if (validProps.includes(bodyProp)) {
              _context6.next = 9;
              break;
            }

            return _context6.abrupt("return", res.status(400).send("users/ PUT request formulated incorrectly." + "Only the following props are allowed in body: " + "'password', 'displayname', 'profilePicURL', 'securityQuestion', 'securityAnswer'"));

          case 9:
            _context6.next = 5;
            break;

          case 11:
            _context6.prev = 11;
            _context6.next = 14;
            return User.updateOne({
              id: req.params.userId
            }, {
              $set: req.body
            });

          case 14:
            status = _context6.sent;

            if (status.nModified != 1) {
              //account could not be found
              res.status(404).send("No user account " + req.params.userId + " exists. Account could not be updated.");
            } else {
              res.status(200).send("User account " + req.params.userId + " successfully updated.");
            }

            _context6.next = 21;
            break;

          case 18:
            _context6.prev = 18;
            _context6.t2 = _context6["catch"](11);
            res.status(400).send("Unexpected error occurred when updating user data in database: " + _context6.t2);

          case 21:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[11, 18]]);
  }));

  return function (_x17, _x18, _x19) {
    return _ref6.apply(this, arguments);
  };
}()); //DELETE user route: Deletes the document with the specified userId from users collection (DELETE)

app["delete"]('/users/:userId', /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime["default"].mark(function _callee7(req, res, next) {
    var status;
    return _regeneratorRuntime["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            console.log("in /users route (DELETE) with userId = " + JSON.stringify(req.params.userId));
            _context7.prev = 1;
            _context7.next = 4;
            return User.deleteOne({
              id: req.params.userId
            });

          case 4:
            status = _context7.sent;

            if (!(status.deletedCount != 1)) {
              _context7.next = 9;
              break;
            }

            return _context7.abrupt("return", res.status(404).send("No user account " + req.params.userId + " was found. Account could not be deleted."));

          case 9:
            return _context7.abrupt("return", res.status(200).send("User account " + req.params.userId + " was successfully deleted."));

          case 10:
            _context7.next = 16;
            break;

          case 12:
            _context7.prev = 12;
            _context7.t0 = _context7["catch"](1);
            console.log();
            return _context7.abrupt("return", res.status(400).send("Unexpected error occurred when attempting to delete user account with id " + req.params.userId + ": " + _context7.t0));

          case 16:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[1, 12]]);
  }));

  return function (_x20, _x21, _x22) {
    return _ref7.apply(this, arguments);
  };
}()); /////////////////////////////////
//ROUNDS ROUTES
////////////////////////////////
//CREATE round route: Adds a new round as a subdocument to 
//a document in the users collection (POST)

app.post('/rounds/:userId', /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime["default"].mark(function _callee8(req, res, next) {
    var status;
    return _regeneratorRuntime["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            console.log("in /rounds (POST) route with params = " + JSON.stringify(req.params) + " and body = " + JSON.stringify(req.body));

            if (!(!req.body.hasOwnProperty("date") || !req.body.hasOwnProperty("course") || !req.body.hasOwnProperty("type") || !req.body.hasOwnProperty("holes") || !req.body.hasOwnProperty("strokes") || !req.body.hasOwnProperty("minutes") || !req.body.hasOwnProperty("seconds") || !req.body.hasOwnProperty("notes"))) {
              _context8.next = 3;
              break;
            }

            return _context8.abrupt("return", res.status(400).send("POST request on /rounds formulated incorrectly." + "Body must contain all 8 required fields: date, course, type, holes, strokes, " + "minutes, seconds, notes."));

          case 3:
            _context8.prev = 3;
            _context8.next = 6;
            return User.updateOne({
              id: req.params.userId
            }, {
              $push: {
                rounds: req.body
              }
            });

          case 6:
            status = _context8.sent;

            if (status.nModified != 1) {
              //Should never happen!
              res.status(400).send("Unexpected error occurred when adding round to" + " database. Round was not added.");
            } else {
              res.status(200).send("Round successfully added to database.");
            }

            _context8.next = 14;
            break;

          case 10:
            _context8.prev = 10;
            _context8.t0 = _context8["catch"](3);
            console.log(_context8.t0);
            return _context8.abrupt("return", res.status(400).send("Unexpected error occurred when adding round" + " to database: " + _context8.t0));

          case 14:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[3, 10]]);
  }));

  return function (_x23, _x24, _x25) {
    return _ref8.apply(this, arguments);
  };
}()); //READ round route: Returns all rounds associated 
//with a given user in the users collection (GET)

app.get('/rounds/:userId', /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime["default"].mark(function _callee9(req, res) {
    var thisUser;
    return _regeneratorRuntime["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            console.log("in /rounds route (GET) with userId = " + JSON.stringify(req.params.userId));
            _context9.prev = 1;
            _context9.next = 4;
            return User.findOne({
              id: req.params.userId
            });

          case 4:
            thisUser = _context9.sent;

            if (thisUser) {
              _context9.next = 9;
              break;
            }

            return _context9.abrupt("return", res.status(400).message("No user account with specified userId was found in database."));

          case 9:
            return _context9.abrupt("return", res.status(200).json(JSON.stringify(thisUser.rounds)));

          case 10:
            _context9.next = 16;
            break;

          case 12:
            _context9.prev = 12;
            _context9.t0 = _context9["catch"](1);
            console.log();
            return _context9.abrupt("return", res.status(400).message("Unexpected error occurred when looking up user in database: " + _context9.t0));

          case 16:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, null, [[1, 12]]);
  }));

  return function (_x26, _x27) {
    return _ref9.apply(this, arguments);
  };
}()); //UPDATE round route: Updates a specific round 
//for a given user in the users collection (PUT)

app.put('/rounds/:userId/:roundId', /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime["default"].mark(function _callee10(req, res, next) {
    var validProps, bodyObj, bodyProp, status;
    return _regeneratorRuntime["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            console.log("in /rounds (PUT) route with params = " + JSON.stringify(req.params) + " and body = " + JSON.stringify(req.body));
            validProps = ['date', 'course', 'type', 'holes', 'strokes', 'minutes', 'seconds', 'notes'];
            bodyObj = _objectSpread({}, req.body);
            delete bodyObj._id; //Not needed for update

            delete bodyObj.SGS; //We'll compute this below in seconds.

            _context10.t0 = _regeneratorRuntime["default"].keys(bodyObj);

          case 6:
            if ((_context10.t1 = _context10.t0()).done) {
              _context10.next = 16;
              break;
            }

            bodyProp = _context10.t1.value;

            if (validProps.includes(bodyProp)) {
              _context10.next = 12;
              break;
            }

            return _context10.abrupt("return", res.status(400).send("rounds/ PUT request formulated incorrectly." + "It includes " + bodyProp + ". However, only the following props are allowed: " + "'date', 'course', 'type', 'holes', 'strokes', " + "'minutes', 'seconds', 'notes'"));

          case 12:
            bodyObj["rounds.$." + bodyProp] = bodyObj[bodyProp];
            delete bodyObj[bodyProp];

          case 14:
            _context10.next = 6;
            break;

          case 16:
            _context10.prev = 16;
            _context10.next = 19;
            return User.updateOne({
              "id": req.params.userId,
              "rounds._id": _mongoose["default"].Types.ObjectId(req.params.roundId)
            }, {
              "$set": bodyObj
            });

          case 19:
            status = _context10.sent;

            if (status.nModified != 1) {
              res.status(400).send("Unexpected error occurred when updating round in database. Round was not updated.");
            } else {
              res.status(200).send("Round successfully updated in database.");
            }

            _context10.next = 27;
            break;

          case 23:
            _context10.prev = 23;
            _context10.t2 = _context10["catch"](16);
            console.log(_context10.t2);
            return _context10.abrupt("return", res.status(400).send("Unexpected error occurred when updating round in database: " + _context10.t2));

          case 27:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, null, [[16, 23]]);
  }));

  return function (_x28, _x29, _x30) {
    return _ref10.apply(this, arguments);
  };
}()); //DELETE round route: Deletes a specific round 
//for a given user in the users collection (DELETE)

app["delete"]('/rounds/:userId/:roundId', /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime["default"].mark(function _callee11(req, res, next) {
    var status;
    return _regeneratorRuntime["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            console.log("in /rounds (DELETE) route with params = " + JSON.stringify(req.params));
            _context11.prev = 1;
            _context11.next = 4;
            return User.updateOne({
              id: req.params.userId
            }, {
              $pull: {
                rounds: {
                  _id: _mongoose["default"].Types.ObjectId(req.params.roundId)
                }
              }
            });

          case 4:
            status = _context11.sent;

            if (status.nModified != 1) {
              //Should never happen!
              res.status(400).send("Unexpected error occurred when deleting round from database. Round was not deleted.");
            } else {
              res.status(200).send("Round successfully deleted from database.");
            }

            _context11.next = 12;
            break;

          case 8:
            _context11.prev = 8;
            _context11.t0 = _context11["catch"](1);
            console.log(_context11.t0);
            return _context11.abrupt("return", res.status(400).send("Unexpected error occurred when deleting round from database: " + _context11.t0));

          case 12:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, null, [[1, 8]]);
  }));

  return function (_x31, _x32, _x33) {
    return _ref11.apply(this, arguments);
  };
}());
