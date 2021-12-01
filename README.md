# TAU-ItayInbal-server
server side for formcreator system


these are the instructions, settings and everything needed to use the formcreator system successfully.

_____SETTING:_____
IDE: Visual Studio Code
package manager: npm
developing OS: windows 10
server-side enviroment: Node.js (to be installed on the developer's machine)
front-end library/framework: React.js (to be installed on the developer's machine)
previous developer: Or Kilim, for questions and inqueries contact me on orkilim@gmail.com

Details for Package.json:


  _____PACKAGES INSTALLED:_____ (to install use: npm install)
  
    dev-dependencies: (to be installed with: npm install <package name> --dev)
    
    nodemon
     ------------
    dependencies:
    
    "cors": "^2.8.5", 
    "cross-env": "^7.0.3",(can be deleted)
    "dotenv": "^10.0.0",
    "edit-json-file": "^1.6.0", (can be deleted)
    "jest": "^27.4.0",
    "mongoose": "^6.0.12",
    "supertest": "^6.1.6"
  
  _____SCRIPTS:_____ (to use: npm <one of the options below>)
    
    "test": "jest --coverage --detectOpenHandles",
    "dev": "nodemon index.js",
    "start": "node server.js"
  
  EXTRA SETTINGS:
    
    AFTER dependencies:
      
      "jest": {
    "testEnvironment": "node",
    "coveragePathIgnorePatterns": [
      "/node_modules/"
    ]
  }

  
  _____IMPORTANT:_____
  
  *a .env document is to be used to configure the connection url to the MongoDB via mongoose and MongoClient
  one was already created with a template of how it should look.
  
  you will need to install the dotenv npm to use it and use the require('./dotenv') command for it to work
  and then you can use process.env.<name of the variable for the url> to use it (in the template file the name of the variable is DB_URL)
  
  _____ROUTES:_______
  
  ALL the routes START with:
  
  http://<hostname>/route/<name of route>
  
  _____GET:_____
  
  http://<hostname>/route/get-form?title=<research name>
  
  retrieves the wanted form given in the "title" query-string attribute (query-STRING, NOT query params)
  
  http://<hostname>/route/get-results?name=<name of research>
  
  retrieves the wanted form's results
  

  _____POST:______
  
  http://<hostname>/route/create-form
  
  body of POST should contain:
  -schema: schema object of form (required)
  -ui: ui options for form (NOT required)
  -name: name given to form (required)
  
  
  this call creates a form and saves it to the database, it returns a link to the form which can be sent to people and they will get a real copy of the form which saves the answers inserted
  
  http://<hostname>/route/save-results
  
  body of POST contain:
  
  -name: name of form (required)
  -answers: the answers the person inputed (required)
  
  this call saves a the set of answers a specific user inputed to the specific collection (specified as "name" in the body of the call) in the database, the answer gets metadata of time and date added to it
  
  
 
  _____CREDENTIALS TO MongoDB ACCOUNT:_____
  
  the credentials can be obtained from Or Kilim (orkilim@gmail.com) or (if changed) from Inbal Zelig (inbaladir@gmail.com)
  
  
