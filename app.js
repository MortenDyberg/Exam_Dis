const https = require ('https');
const path = require("path");
const fs = require ('fs');
const seaport = require('seaport');
const sp = seaport.connect('localhost', 9090);
const express = require('express');
const app = express();
const bodyParser = require('body-parser')

//To parse request bodies
app.use(bodyParser.json());

const accountRoute = require('./routes/accounts.js');
app.use('/accounts', accountRoute)
const clientRoute = require ('./routes/client.js');
app.use('/clients', clientRoute);

//Instance of an ssl server using a key and a certification
const sslServer = https.createServer({
    key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')) 
}, app);

//Listening on port assigned by seaport
sslServer.listen(sp.register('server'), ()=>{
    console.log(`listening on port ${sp.query()[0].port}`);
});
