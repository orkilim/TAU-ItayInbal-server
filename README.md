# TAU-ItayInbal-server
server side for formcreator system

these are the instructions, settings and everything needed to use the formcreator system successfully.

__STEPS:__

in order to use the Formcreator successfully the following steps need to be done:

__Installation:__

1. download and install FROM THE INTERNET Node.js (and NPM with it), Git, and your prefered IDE (I used Visual Studio Code)
  
  (the front-end is written with React.js)

2. create a new folder for the server-side (not have to be near the front-end folder but recommended)
3. ```$ cd (backend-code-folder)```
4. ```$ git clone https://github.com/orkilim/TAU-ItayInbal-server.git```
5. ```$ cd (backend-code-folder-created-by-the-clone-command)```
6. ```$ npm install``` to install all the used dependencies ALREADY in the project
7. ```$ npm install --dev``` to install dev dependencies
8. update .env file with relevant credentials and data
9. ```$ npm start``` to start server
you have now downloaded the git repository to you local machine and downloaded and installed all the required dependancies(/libraries)

__RUNNING THE SERVER:__
 
 ALTHOUGH coming with the ```$ git clone``` done earlier
 
 check for the following line in the PACKAGE.JSON file, under "scripts"
 
 "test": "jest --coverage --detectOpenHandles",
 "dev": "nodemon index.js",
 "start": "node server.js"
 
 usage:
 
 run the following commands in the terminal of the IDE (or the OS's command line after navigating to the proper folder)
 
 commands:
 
1. ```$ npm test``` - to run existing and to-be written tests
 
2. ```$ npm start``` - to run/activate the server. use this command BEFORE using submitting http requests (be it through the UI/front-end/system interface OR Postman)

3. ```$npm run dev```- to run server using nodemon (so you won't have to restart it every change)

__STOP THE RUNNING COMMAND WITH Ctrl+C on Windows or Linux__




__using the server-side WITHOUT a front-end:__

the server is accessible with HTTP requests

I used Postman to send http requests to the server so i recommend using it (need to be downloaded and installed from the internet first)
after that has been done you can use the following http methods and routes to use the server with Postman:


We designed the UI and the server to work with each other, the following routes in the UI call the following routes in in the server:

https://(hostname)/formcreator  --->  http://(hostname)/create-form

https://(hostname)/forms/:(form-id) ---> 1. http://(hostname)/get-form?title=(research name)
                                         2. http://(hostname)/save-results
                                         
https://(hostname)/results  --->    http://(hostname)/get-results?name=(name of research)


__ROUTES:__
    
   to be written in the URL or Postman
    
  routes for __GET__ method:
  
  ```http://(hostname)/get-form?title=(research name)```
  
  retrieves the wanted form given in the "title" query-string attribute (query-STRING, NOT query params)
  
  
  
  
  ```http://(hostname)/get-results?name=(name of research)```
  
  retrieves the wanted form's results
  


  routes for __POST__ method:
  
  ```http://(hostname)/create-form```
  
  body of POST should contain:
  -schema: schema object of form (required)
  -ui: ui options for form (NOT required)
  -name: name given to form (required)
  
  
  this call creates a form and saves it to the database, it returns a link to the form which can be sent to people and they will get a real copy of the form which saves the answers inserted
  
  
  
  
  
  ```http://(hostname)/save-results```
  
  body of POST contain:
  
  -name: name of form (required)
  -answers: the answers the person inputed (required)
  
  this call saves a the set of answers a specific user inputed to the specific collection (specified as "name" in the body of the call) in the database, the answer gets metadata of time and date added to it
  
 

__EXTRA STUFF TO KNOW:__

SETTINGS:
package manager: npm
server-side enviroment: Node.js 
front-end library/framework: React.js 
previous developer: Or Kilim, for questions and inqueries contact me on orkilim@gmail.com

__Details for Package.json:__


  __PACKAGES INSTALLED: (to install use: npm install)__
  
    dev-dependencies: (to be installed with: npm install (package name) --dev)
    
    nodemon
     ------------
    dependencies: (to be installed with npm install (package name)
    
    "cors": "^2.8.5", 
    "cross-env": "^7.0.3",(can be deleted)
    "dotenv": "^10.0.0",
    "edit-json-file": "^1.6.0", (can be deleted)
    "jest": "^27.4.0",
    "mongoose": "^6.0.12",
    "supertest": "^6.1.6"
    
    EXTRA SETTINGS (for testing):
    
    AFTER dependencies in package.json file:
      
      "jest": {
    "testEnvironment": "node",
    "coveragePathIgnorePatterns": [
      "/node_modules/"
    ]
  }
  
  __IMPORTANT:__
  
  use the ```require('./dotenv').config()``` line inside any javascript file (preferably at the top of file) you want to have access to the .env file and its contents
  and then you can use process.env.(name of the variable for the url) to use it (in the template file the name of the variable is DB_URL)
  
  for example: 
  
  ...
  ```
  require('./dotenv').config()
  const DB_URL=process.env.DB_URL
  ```
  ...
  you now can use the DB_URL as a regular variable
  
  
  
  
  ## link for FRONT-END repository: https://github.com/orkilim/TAU-ItayInbal
  
  
  
  
