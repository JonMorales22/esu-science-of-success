<h1>ESU Science of Success Web App</h1>


This is a web application created to help the East Stroudsburg University Psychology Department conduct research.

It runs ontop of the MERN stack, which stands for:
* Mongo - database 
* Express - routing/middleware
* React - frontend 
* Node - scripting/server 

The backend uses Mongo, Express, and Node to function--while the frontend was created using React.

The app currently lives on a Heroku server and uses Mlab Cloud Database Services to host the database.

<h2>Installation</h2>

To get the app working locally on your machine make sure you have the following installed first:

* NVM - aka the "Node Version Manager," this is a handy tool for installing and switching between different node versions. things will occur if you install Node manually.
* Node 8.0.0 - asdfsafds
* Yarn - Node package manager. Node comes natively with a built in package manager called NPM, but I like yarn more... so this project relies on yarn.

First install NVM.

Once you have NVM installed, you can use it to install Node version 8.0.0 by running the following command:

`nvm use node 8.0.0`

Then use NPM (the native node package manager) to install yarn:

`nvm install -g yarn` **Note: this command saves yarn globally on your machine. If you don't wish to install it globablly, then omit the -g.

Now you can clone the repo (if you haven't done so already) and run the following command in the root of the repo directory:

`yarn install`

When that is finished, go to the client folder and run the same command:

```
cd client
yarn install
``` 

Now if everything worked out right, you should be able to type in the following command to get the app to work locally on your machine.
`yarn run start:dev`

By default, the frontend listens on port 3000, while the backend listens on port 5000.

congrats! You should have the app working locally on your machine! If not, see below for some common errors.

<h2>Further Explanation of Technologies Used</h2>
COMING SOON!!!

<hr>

<h2>Troubleshooting</h2>
Common Errors:

* Not using NVM.
  * This is a common error that a lot of people new to Node come across. A lot of Node apps expect you to have NVM and Node installed. In my experience, weird things tend to happen if you try to install node manually. So PLEASE.... I implore you to use NVM.
* Using wrong Node version.
  * this project uses Node 8.0.0. Using other versions may result in unexpected bevious
* Using NPM instead of Yarn
  * For the most part this should be fine. However the start scripts will not work! If you REALLY feel like you don't want to use yarn and want to use NPM or another package manager, edit the start scripts sections under client/package.json


There 3 different start scripts:
1. start:client
2. start:server
3. start:dev

