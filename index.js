const port=require('./consts')

const {app}=require('./server')

//setting port number as 3030 or as enviroment variable dictates

//starts the server-listening for requests
app.listen(port, () => console.log('server listening on port: ', port));