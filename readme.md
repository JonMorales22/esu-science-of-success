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

* NVM - aka the "Node Version Manager," this is a handy tool for installing and switching between different node versions. Bad/unexpected things will occur if you install Node manually.
* Node 8.0.0 - Powerful, fast, javascrript server side scripting 
* Yarn - Node package manager. Node comes natively with a built in package manager called NPM, but I like yarn more... so this project relies on yarn.

First install NVM from this link:
https://github.com/creationix/nvm

Once you have NVM installed, you can use it to install Node version 8.0.0 by running the following command:

````
nvm install 8.0.0
nvm use node 8.0.0
````
**Note: Everytime you restart command line/terminal, node will revert back to whatever version has been specified as the default. If you want to change the default version use the following command:**
`nvm alias default 6.1.0`


Then use NPM (the native node package manager) to install yarn:

`nvm install -g yarn` 

Now that you have yarn installed, install Concurrently and Nodemon. 

```
yarn global add concurrently
yarn global add nodemon
```
Now you can clone the repo (if you haven't done so already) and run the following command in the root of the repo directory:

`yarn install`

When that is finished, go to the client folder and run the same command:

```
cd client
yarn install
``` 

Now if everything worked out right, you should be able to type in the following command to get the app to work locally on your machine.

`yarn run start:dev`

Make sure you the previous command in the client directory!

Congrats! You should have the app working locally on your machine! If everything worked out properly, you should be able to go type in localhost:3000 in your favorite web browser and see the first page of the application! If not, see below for some common errors.

By default, the frontend listens on port 3000, while the backend listens on port 5000.

If everything is functional, you can move on to set your environment variables.

<h2>Setting up Environment Variables</h2>

First create a file named .env in the backend directory. Inside of it fill in the following information:
```
DB_USER=
DB_PASSWORD=
DB_NAME=
PORT=5000
DROPBOX_TOKEN=
GOOGLE_ACCOUNT_TYPE=
GOOGLE_PROJECT_ID=
GOOGLE_PRIVATE_KEY_ID=
GOOGLE_PRIVATE_KEY=
GOOGLE_CLIENT_EMAIL=
GOOGLE_CLIENT_ID=
GOOGLE_AUTH_URI=
GOOGLE_TOKEN_URI=
GOOGLE_AUTH_PROVIDER_CERT=
GOOGLE_CLIENT_CERT_URL
```
Just fill in whatever information needed AFTER the equals sign! Do not put any spaces right after the equal signs or use quotation marks!
```
DB_USER= Example_User // THIS IS WRONG
DB_PASSWORD="Example_Password" //THIS IS ALSO WRONG!!!!
DB_NAME=ExampleUser //this is correct!
DROPB_BOX_TOKEN=An Example With Spaces // This is also correct. Adding spaces after the equals sign is ok, just don't add them immediately after the equals sign.
```
You should be able to find the Dropbox and Google token data from the developers console from each platform. 

<h4>**Special note about filling in the GOOGLE_PRIVATE_KEY variable**</h4>
Google will make give you the option to download the token. 
Download the token as a .json file. Inside of it there will be a "private_key" key which looks something like this:
```
"private_key": "-----BEGIN PRIVATE KEY-----\nPRIVATEKEYDATAPRIVATEKEYDATAPRIVATEKEYDATA-----END PRIVATE KEY-----\n",
```
Inside the GOOGLE_PRIVATE_KEY environment variable, just copy the private key data after the string: "-----BEGIN PRIVATE KEY-----\n" and before the string: "-----END PRIVATE KEY-----\n"

<h2>Troubleshooting</h2>
Common Errors:

* Not using NVM.
  * This is a common error that a lot of people new to Node come across. A lot of Node apps expect you to have NVM and Node installed. In my experience, weird things tend to happen if you try to install node manually. So PLEASE.... I implore you to use NVM.
* Using wrong Node version.
  * this project uses Node 8.0.0. Using other versions may result in unexpected bevious
* Using NPM instead of Yarn
  * For the most part this should be fine. However the start scripts will not work! If you REALLY feel like you don't want to use yarn and want to use NPM or another package manager, edit the start scripts sections under client/package.json
* The default ports are occupied by other processes.
  * To change the port thar the front end listens to, go into the client/scripts/start.js and look for a line that says (it should be around line 43)
    `const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;`
    Change the port to whatever port you desire (that is still valid!)
  * There are a couple of ways you can change the backend server port:
    *  First try to edit the .env file in the /backend directory. In the .env file, change the PORT variable to whatever port you would like.
    *  If that doesn't work, edit the server.js file in the /backend directory directly. There is a line near the top (line 14) that says:
       `const PORT = process.env.PORT || 3001;`
       Change the 3001 to whatever number you would like.
  * IMPORTANT!!! If you change the backend port, you have to let the frontend know by editing the package.json file. Go to the /client/package.json file and edit the following line. Make sure you edit the package.json file under the client directory and not the root directory!!
       `"proxy": "http://localhost:5000",` Change 5000 to whatever port you specified above.

<h2>Notes:</h2>

The project is separated into two separate componenets, the frontend and backend. Theoretically, you should be able to switch out the backend and replace it with whatever other backend you like, and the same goes for the frontend. As long as you handle the API endpoints properly the app should still work.

As such there are two separate package.json files, because the dependencies are handled independetly of each other. This may seem a little strange at first, but since the backend and frontend are modularized (thereotically) they shouldn't come into conflict with eachother.

The reason I keep writing "theortically" is because I haven't tested this, but I don't see any reason why it shouldn't work.

There are 3 separate start commands in the client/package.json file:
*  `yarn run start:dev` - starts up both the front end and backend servers
*  `yarn run start:server`- only runs the backend server
*  `yarn run start:client`- starts up only the front end server

<hr>
