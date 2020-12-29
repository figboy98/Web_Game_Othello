const http = require('http');
const register = require('./register');
const path = require('path');
const url = require('url');



const othelloServer = http.createServer(function(req, res){
    const parsedUrl = url.parse(req.url,true);
    const pathName = parsedUrl.pathname;

    switch(req.method){
        case 'POST':
            switch(pathName){
                case '/register':
                    register.doRegister(req,res);
                    break;
              
                default:
                    answer = 'Erro';
            }
    }
});


othelloServer.listen(8103);

console.log('Listening on port 8103...');
