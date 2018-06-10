<h1>ESU Science of Success Web App</h1>

<h2>App Overview</h2>

This is a web application created to help the East Stroudsburg University Psychology Department conduct research.

It runs on top of the MERN stack, which stands for:
* Mongo - database 
* Express - routing/middleware
* React - user interface 
* Node - scripting/server 

The <strong>backend</strong> uses Mongo, Express, and Node to function, while the <strong>frontend</strong> uses React.

The app currently lives on a Heroku server and uses Mlab Cloud Database Services to host the database.

<br>

<h2>Installation</h2>

<em>Overview</em>

To get the app working locally on your machine, this guide will run you through the installation of the following:

* NVM — aka the "Node Version Manager." This is a handy tool for installing and switching between different node versions. <strong>Bad or unexpected things will occur if you install Node manually.</strong>

* Node 8.0.0 — Powerful, fast, JavaScript server-side scripting

* Yarn — Node package manager. Node comes natively with a built-in package manager called NPM, but I like yarn more... so this project relies on yarn.

<br>

<em>Step-by-Step Frontend Installation Guide</em>

1.) Install NVM from this link:
https://github.com/creationix/nvm

<br>
2.) Once you have NVM installed, use it to install Node version 8.0.0 by running the following command:

````
nvm install 8.0.0
nvm use node 8.0.0
````
**Note: Every time you restart the command line / terminal, node will revert to whatever version has been specified as the default. For example, if you want to change the default version to Node 6.1.0 use the following command:**
`nvm alias default 6.1.0`
<br>
3.) After installing node, you will gain access to NPM. Now use NPM to install yarn:

`npm install -g yarn` 
<br>
4.) Now that you have yarn installed, install Concurrently and Nodemon. 

```
yarn global add concurrently
yarn global add nodemon
```
<br>
5.) You can now clone the repo (if you haven't done so already) and run the following command in the root of the repo directory:

`yarn install`
<br>
6.) When that is finished, go to the /client folder and run the same command:

```
cd client
yarn install
``` 
<br>
7.) If everything worked out, you should be able to type the following command to get the app working locally on your machine:

`yarn run start:dev`

<strong>Make sure you this command in the /client directory!</strong>
<br>
8.) Congrats! You should have the front end working locally on your machine. If everything worked out properly, you should be able to visit localhost:3000 in your favorite web browser and see the first page of the application. If not, see below for some common errors.

Note: By default, the frontend listens on port 3000, while the backend listens on port 5000.

If the front end is functional, you can move on to set your environment variables.
<br>
<em>Backend Installation Guide</em>

1.) Create a file named .env in the /backend directory. Inside of that file, input the following information:
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
<strong>Note: Just fill in whatever information needed AFTER the equals sign! Do not put any spaces right after the equal signs or use quotation marks!</strong>
```
DB_USER= Example_User // THIS IS WRONG
DB_PASSWORD="Example_Password" //THIS IS ALSO WRONG!!!!
DB_NAME=ExampleUser //this is correct!
DROPB_BOX_TOKEN=An Example With Spaces // This is also correct. Adding spaces after the equals sign is ok, just don't add them immediately after the equals sign.
```
2.) To fill in the Dropbox and Google information, you should be able to visit the developers console from each platform and pull the relevant token information from there.

<h4>**Special note about filling in the GOOGLE_PRIVATE_KEY variable**</h4>
Google will make give you the option to download the token. 
Download the token as a .json file. Inside of it there will be a "private_key" key which looks something like this:

`
"private_key": "-----BEGIN PRIVATE KEY-----\nPRIVATEKEYDATAPRIVATEKEYDATAPRIVATEKEYDATA-----END PRIVATE KEY-----\n",
`

Inside the GOOGLE_PRIVATE_KEY environment variable, just copy the private key data after the string: "-----BEGIN PRIVATE KEY-----\n" and before the string: "-----END PRIVATE KEY-----\n"

<h2>Troubleshooting</h2>

Common Errors:

* Not using NVM.
  * This is a common error that a lot of people new to Node come across. A lot of Node apps expect you to have NVM and Node installed. In my experience, weird things tend to happen if you try to install node manually. So PLEASE.... I implore you to use NVM.
* Using wrong Node version.
  * this project uses Node 8.0.0. Using other versions may result in unexpected beviour
* Using NPM instead of Yarn
  * For the most part this should be fine... However the start scripts will <strong>not</strong> work! If you REALLY feel like you don't want to use yarn and want to use NPM or another package manager, edit the start script sections under client/package.json
* The default ports are occupied by other processes.
  * To change the port the front end listens to, go into the client/scripts/start.js and look for a line that says the following (it should be around line 43):
    `const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;`
    Change the port to whatever port you desire (that is still valid)
  * There are a couple of ways you can change the backend server port:
    *  First try to edit the .env file in the /backend directory. In the .env file, change the PORT variable to whatever port you would like.
    *  If that doesn't work, edit the server.js file in the /backend directory directly. There is a line near the top (line 14) that says:
       `const PORT = process.env.PORT || 3001;`
       Change the 3001 to whatever number you would like.
  * IMPORTANT!!! If you change the backend port, you must let the frontend know by editing the package.json file. Go to the /client/package.json file and edit the following line (make sure you edit the package.json file under the client directory and not the root directory!):
       `"proxy": "http://localhost:5000",` Change 5000 to whatever port you specified above.

<h2>Other Notes:</h2>

The project is separated into two separate components, the frontend and backend. Theoretically, you should be able to switch out the backend and replace it with whatever other backend you like, and the same goes for the frontend. As long as you handle the API endpoints properly, the app should still work.

Thus, because the app is separated into two components, it utilizes two separate package.json files — the dependencies are handled independently of each other. This may seem a little strange at first, but since the backend and frontend are modularized (theoretically) they shouldn't conflict with each other.

The reason I keep writing "theoretically" is because <strong>I haven't tested this</strong>, but I don't see any reason why it shouldn't work.

There are 3 separate start commands in the client/package.json file:
*  `yarn run start:dev` - starts up both the front end and backend servers
*  `yarn run start:server`- only runs the backend server
*  `yarn run start:client`- starts up only the front end server

<hr>
