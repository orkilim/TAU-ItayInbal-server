# TAU-ItayInbal-server
server side for formcreator system

__IMPORTANT TIPS: 

1. each time you see ```$ command``` it means to type the command (without the $) in the terminal and press Enter key to execute it

2. __STOP THE RUNNING COMMAND WITH Ctrl+C on Windows or Linux__


these are the instructions, settings and everything needed to use the formcreator system successfully.

__STEPS:

in order to use the Formcreator successfully the following steps need to be done:

__installation:

1. download and install __FROM THE INTERNET__ Node.js (and NPM with it), Git, and your prefered IDE (I used Visual Studio Code)
2. create a new folder for the server-side
3. open the terminal on the specified folder, there are two ways to do so: 

a. open the cmd (or the OS command line) and navigate to the desired folder with ```$ cd path/to/folder``` 
OR
b.right-clicking on the folder and selecting "open with (prefered IDE)"- in my case it would be "open with Visual Studio Code" and the symbol of the IDE near it,
  press the Terminal tab on the top bar and press "New Terminal"
  
4. enter ```$ git init``` and follow the instructions
5. use the following commands to clone and work with this Github repository:
  
  5.1 ```$ git clone https://github.com/orkilim/TAU-ItayInbal-server.git``` to clone(/download the repository to your local machine)
  5.2 ```$ npm install``` to install all the used dependencies ALREADY in the project

you have now downloaded the git repository to you local machine and downloaded and installed all the required dependancies(/libraries)

__RUNNING THE SERVER:__
 
 ALTHOUGH coming with the ```$ git clone``` done earlier in stage 5.1
 
 check for the following line in the PACKAGE.JSON file, under "scripts"
 
 "test": "jest --coverage --detectOpenHandles",
 "dev": "nodemon index.js",
 "start": "node server.js"
 
 __usage:__
 
 run the following commands in the terminal of the IDE (or the OS's command line after navigating to the proper folder)
 
 for example when I use the commands it looks like so: C:\Users\Or\Desktop\TAU- work\Itay and Inbal's project\formcreator_server>npm run dev
 
 commands:
 
1. ```$ npm test``` - to run existing and to-be written tests
 
2. ```$ npm run dev``` - to run/activate the server. use this command BEFORE using submitting http requests (be it through the UI/front-end/system interface OR Postman)

__STOP THE RUNNING COMMAND WITH Ctrl+C on Windows or Linux__

__saving changes in the code to this repository:

use the following commands to commit (=send changes) to the github repository (=save changes in github online repository):

1. ```$ git add nameOfFile``` for a specific file OR ```git add .``` to add all files
2. ```$ git commit -m "(your commit message goes here)"``` to commit changes to the repository (add message if you want where it says "(your commit message here)")
3. ```$ git push``` to send the changes

__using the server-side WITHOUT a front-end:

I used Postman to send http requests to the server so i recommend using it (need to be downloaded and installed from the internet first)

after that has been done you can use the following http methods and routes to use the server with Postman:

__ROUTES:
  
  ALL the routes START with:
  
  http://(hostname)/(name of route)
  
  routes for __GET__ method
  
  ```http://(hostname)/get-form?title=(research name)```
  
  retrieves the wanted form given in the "title" query-string attribute (query-STRING, NOT query params)
  
  ```http://(hostname)/get-results?name=(name of research)```
  
  retrieves the wanted form's results
  

  routes for __POST__ method
  
  ```http://(hostname)/route/create-form```
  
  body of POST should contain:
  -schema: schema object of form (required)
  -ui: ui options for form (NOT required)
  -name: name given to form (required)
  
  
  this call creates a form and saves it to the database, it returns a link to the form which can be sent to people and they will get a real copy of the form which saves the answers inserted
  
  ```http://(hostname)/route/save-results```
  
  body of POST contain:
  
  -name: name of form (required)
  -answers: the answers the person inputed (required)
  
  this call saves a the set of answers a specific user inputed to the specific collection (specified as "name" in the body of the call) in the database, the answer gets metadata of time and date added to it
  
 

__EXTRA STUFF TO KNOW:

_____SETTINGS:_____
package manager: npm
server-side enviroment: Node.js 
front-end library/framework: React.js 
previous developer: Or Kilim, for questions and inqueries contact me on orkilim@gmail.com

Details for Package.json:


  _____PACKAGES INSTALLED:_____ (to install use: npm install)
  
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
    
    __EXTRA SETTINGS (for testing):__
    
    AFTER dependencies in package.json file:
      
      "jest": {
    "testEnvironment": "node",
    "coveragePathIgnorePatterns": [
      "/node_modules/"
    ]
  }
  
  __IMPORTANT:__
  
  *a .env document is to be used to configure the connection url to the MongoDB via mongoose and MongoClient
  one was already created with a template of how it should look.
  
  you will need to download install the dotenv npm (ALREADY INSTALLED IN THIS REPOSITORY) to use it. 
  
  use the ```require('./dotenv').config()``` command inside the javascript files (preferably at the top of file) to have access to the .env file and its contents
  and then you can use process.env.(name of the variable for the url) to use it (in the template file the name of the variable is DB_URL)
  
  for example: 
  
  ...
  ```
  require('./dotenv').config()
  const DB_URL=process.env.DB_URL
  ```
  ...
  you now can use the DB_URL as a regular variable
  
  
  
  
  
  
  
  
  
