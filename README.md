# TAU-ItayInbal-server
Server side for formcreator system

The system runs on Red Hat Linux

__The front-end is written with React.js__

## Link to FRONT-END repository: https://github.com/orkilim/TAU-ItayInbal

These are the instructions, settings and everything needed to use the formcreator system successfully.

__STEPS:__

In order to use the Formcreator successfully the following steps need to be done:

__Installation:__

1. Download and install Node.js (and NPM with it)

NODE.JS- https://nodejs.org/en/download/

(we used NODE.js v14.18.1)
  
2. ``` git clone https://github.com/orkilim/TAU-ItayInbal-server.git```
3. ``` cd TAU-ItayInbal-server``` <br/>
4. ``` npm install``` to install all the used dependencies in the project <br/>
<br/>
Packages can be found at package.json
<br/>
5. ``` npm install --dev``` to install dev dependencies <br/>
6. Update .env file, found inside the TAU-ItayInbal-server folder with relevant credentials and data <br/>

__Inside .env__:
  
  PORT- defines the port which the back-end server listens to <br/>
  DB_URL- the connection url from the server-side to the mongoDB form creator database
  
  To get the connection url (DB_URL), enter the MongoDB platform with the formcreator account
  then go to "connect"-->"connect your application"-->choose driver "Node.js" and version "4.0 or later"--> you will get the connection url<br/>

  In the link you'll have to enter 3 parameters: ```<user>```, ```<pass>``` and ```<nameOfDatabase>```<br/>
  
  To create/update the user and the password:<br/>
  go to Database Access (in the side menu) and there you can create or edit users<br/>

7. ``` npm start``` to start server <br/>

 
 We designed the UI and the server to work with each other, the following routes in the UI call the following routes in in the server:
```
UI/Front-End                           Server/Back-End                          

https://(hostname)/create-form  --->  http://(hostname)/create-form

https://(hostname)/forms/:(form-id) ---> 1. http://(hostname)/get-form?title=(research name)
                                         2. http://(hostname)/save-results
                                         
https://(hostname)/results  --->    http://(hostname)/get-results?name=(name of research)
```

 __TO CHANGE THE UI-HOST IP:__
 
 Since we only use it in one place in one line, the ui host address is declared as a VARIABLE in __controller.js__ as ```const uihost="(your address here)"```<br/>
 
 change as you wish through there
 
 
 __SERVER USAGE:__
 
 Run the following commands in the terminal of the IDE (or the OS's command line after navigating to the proper folder)
 
 COMMANDS:
 
1. ``` npm test``` - to run existing and to-be written tests
 
2. ``` npm start``` - to run/activate the server. use this command BEFORE starting the front-end (and beforesending requests in Postman)

3. ```npm run dev```- to run server using nodemon (so you won't have to restart it every change)



__ROUTES:__
    
   To be written in the URL or Postman
    
  Routes for __GET__ method:
  
  1. ```http://(hostname)/get-form?title=(research name)```
  
  Retrieves the wanted form given in the "title" query-string attribute (query-STRING, NOT query params)
  
  <br/>
  <br/>
  
  2. ```http://(hostname)/get-results?name=(name of research)```
  
  Retrieves the wanted form's results
  <br/>

3. ```http://(hostname)/get-forms-names```
    retrieves the name of all the collections in the formcreator database

  Routes for __POST__ method:
  
  1. ```http://(hostname)/create-form```
  
  Body of POST should contain:
  -schema: schema object of form (required)
  -ui: ui options for form (NOT required)
  -name: name given to form (required)
  
  
  This call creates a form and saves it to the database, it returns a link to the form which can be sent to people and they will get a real copy of the form which saves the answers inserted
  
  
  <br/>
  <br/>
  
  2. ```http://(hostname)/save-results```
  
  Body of POST contain:
  
  -name: name of form (required)
  -answers: the answers the person inputed (required)
  
  This call saves a the set of answers a specific user inputed to the specific collection (specified as "name" in the body of the call) in the database, the answer gets metadata of time and date added to it
  
 

    TESTING SETTINGS (for testing):
    
    AFTER dependencies in package.json file:
      
      "jest": {
    "testEnvironment": "node",
    "coveragePathIgnorePatterns": [
      "/node_modules/"
    ]
  }
  
  
 
