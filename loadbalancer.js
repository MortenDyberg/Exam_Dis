const https = require('https');
const fs = require ('fs');
const path = require("path");
const httpProxy = require('http-proxy')
const seaport = require('seaport');

const sp = seaport.connect('localhost', 9090);

//Round robin load balancing
const roundRobin = (i) =>{
    return (req, res)=>{
        var addresses = sp.query();
        if (addresses.length === 0){
        res.end('Ingen servere');
        }
        i = (i + 1) % addresses.length;

        var host = addresses[i].host.split(":").reverse()[0];
        var port = addresses[i].port;
        proxy.web(req, res, { target: 'https://' + host + ':' + port });	
    }
}

var i = -1;
const proxy = httpProxy.createProxyServer({secure: false});
const server = https.createServer({
    key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
    }, 
    roundRobin(i))
    server.listen(443, 'localhost', ()=>{
        console.log('listening');
});


