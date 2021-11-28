const {app}=require('./server')

//setting port number as 3030 or as enviroment variable dictates
const port = process.env.PORT || 3030;


//starts the server-listening for requests
app.listen(port, () => console.log('server listening on port: ', port));