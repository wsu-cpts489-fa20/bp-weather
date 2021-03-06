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

Week 3
* WeatherStation.js
  * Added 3 new icons favorite, record, and delete. 
  * Favorite icon only shows during search. 
  * Delete and shift icon only shows in Favorites.
* CoursesPage.js
  * Modified it to be different from FeedPage which is our search page.
  * User can delete favorites now.
  * The weather stations are pulled from mongodb.
* Other progess
  * Mongodb is connected, favorite weather stations are now on mongodb.
  * Icons have been made more repsonsive looking.
  * History page can store information when the user hits the record button.
  * Hosted on EB but currently having a 502 bad gateway issue.
  
Week 4
* LoginPage.js
  * Added other oauth logins 
  * Google
  * Facebook
* WeatherStation.js
  * Added coordinates to each station
  * Added Country to each station
* Other progress
  * Moved the icons to the top right
  * Moved the search bar to the center
  * Added an icon for the website
  * Delete from history table

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
