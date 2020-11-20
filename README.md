# BP Weather App

The idea is to build a comprehensive and highly customizable weather app. Besides designating “favorites” and obtaining current weather data from those favorites, the app should provide the option to view weather history for a given location, and to customize what data to show and how to show it. Numerous other customizations, including color schemes, units, and refresh frequency, should also be available through an options page.

* Ability to sign in as a guest 
* Ability to sign in with GitHub 
* Ability to add weather stations
* Ability to delete weather stations
* Ability to edit and delete a user account

Week 2
* FeedPage.js
* LoginPage.js

This repo serves as the starting code for all of the CptS 489 project teams in the
Fa20 semester. It will be pushed to their repos, deployed to their instances on
AWS EB, and served through https://[proj-name].bfapp.org.

To connect the app to your MongoDB database, create a .env file in the 
project root directory. On the first line of that file, add this:
MONGO_STR=<YOUR_MONGO_CONNECTION_STRING>

You'll should also add the client ids and client secrets of each of your 
OAuth providers to the .env file. Here's an example for GitHub:
GH_CLIENT_ID='<CLIENT ID INSIDE QUOTES>'
GH_CLIENT_SECRET='<CLIENT SECRET INSIDE QUOTES>'

Make sure to add .env to your .gitignore file so that your secrets aren't
stored in your GitHub repo!

The app is presently set be served to http://localhost:8081 through the command
npm run dev. You'll need to update DEPLOY_URL in server.js for remote deployment.