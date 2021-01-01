const http = require('http');
const register = require('./register');
const ranking = require ('./ranking');
const join = require('./join');
const leave = require('./leave');
const html = require('./html');
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
                case '/ranking':
                    ranking.doGetRanking(req,res);
                    break;
                case '/join':
                    join.doJoin(req,res);
                    break;
                case '/leave':
                    leave.doLeave(req,res);
                    break;
                default:
                    answer = 'Erro';
            }
            break;
        case 'GET':
            switch(pathName){
                case '/update':
                    break;
                default:
                    html.deliver(pathName,req,res);
                    break;

            }
    }
});


othelloServer.listen(8103);

console.log('Listening on port 8103...');
