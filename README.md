# Chapter 21 Code
This code base captures the state of the speedgolf React app at the end of
Chapter 21, in which integrate a MongoDB database into our middleware. The
account information of users who authenticate through GitHub OAuth is
written to a MongoDB database, so that when they log in, the account info
can be retreived by the app.

The app can be launched to http://localhost:8081 through the command
npm run dev.