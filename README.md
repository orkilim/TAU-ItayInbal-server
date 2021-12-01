# TAU-ItayInbal-server
server side for formcreator system


these are the instructions, settings and everything needed to use the formcreator system successfully.

SETTING:
IDE: Visual Studio Code
package manager: npm
developing OS: windows 10
server-side enviroment: Node.js (to be installed on the developer's machine)
front-end library/framework: React.js (to be installed on the developer's machine)
previous developer: Or Kilim, for questions and inqueries contact me on orkilim@gmail.com

Details for Package.json:


  PACKAGES INSTALLED: (to install use: npm install)
  
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
  
  SCRIPTS: (to use: npm <one of the options below>)
    
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

  
  *a .env document is to be used to 
  
  
  
  
