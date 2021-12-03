# TAU-ItayInbal-server
server side for formcreator system

__IMPORTANT TIP: 

each time you see '''$ command''' it means to type the command (without the $) in the terminal and press Enter key to execute it



these are the instructions, settings and everything needed to use the formcreator system successfully.

__STEPS:

in order to use the Formcreator successfully the following steps need to be done:

1. download and install Node.js (and NPM with it), Git, and your prefered IDE (I used Visual Studio Code)
2. create a new folder for the server-side
3. open the terminal on the specified folder, there are two ways to do so: 

a. open the cmd (or the OS command line) and navigate to the desired folder with '''$ cd path/to/folder''' 
OR
b.right-clicking on the folder and selecting "open with (prefered IDE)"- in my case it would be "open with Visual Studio Code" and the symbol of the IDE near it,
  press the Terminal tab on the top bar and press "New Terminal"
  
4. enter '''$ git init''' and follow the instructions
5. use the following commands to clone and work with this Github repository:
  
  5.1 '''$ git clone https://github.com/orkilim/TAU-ItayInbal-server.git''' to clone(/download the repository to your local machine)
  5.2 '''$ npm install''' to install all the used dependencies
  5.3 '''$ git remote add origin https://github.com/orkilim/TAU-ItayInbal-server.git'''

you have now downloaded the git repository to you local machine and downloaded and installed all the required dependancies(/libraries)

_____SETTING:_____
package manager: npm
server-side enviroment: Node.js 
front-end library/framework: React.js 
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
  
 
  
  
