//setting port number via .env file
require("dotenv").config();
const port=process.env.PORT
//importing our server's settings
const {app}=require('./server')


//starts the server-listening for requests
app.listen(port, () => console.log('server listening on port: ', port));