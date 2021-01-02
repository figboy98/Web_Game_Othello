const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const ranking = require('./ranking.js');

var regData = {
    users: []
};
var json;
var regFile = path.resolve(__dirname, 'register.json');

function doRegister(req,res){
    let body = '';
    let query;
    var flag = true;
    req
    .on('data', (chunk) => { body += chunk;  })
    .on('end', () => { 
            try {
            console.log("User: " + body);
            var query = JSON.parse(body);
        }
        catch(err) {

            console.log(err.message);
            response.writeHead(400, headers["plain"]);
            response.write(JSON.stringify({error: "Error parsing JSON request: " + err + "."}));
            response.end();
            return;
        }
        try { 
            query = JSON.parse(body);
            fs.readFile(regFile, 'utf8' ,function readFileCallback(err, data){
                if(err){
                    console.log(err);
                }else{
                    regData = JSON.parse(data);
                    regData.users.forEach(function(value){
                        if(value.nick == query.nick){//nick  ok
                            flag = false;
                            const hashPass = crypto.createHash('md5').update(query.pass).digest('hex');
                            if(value.pass == hashPass){ //Pass  ok
                                var answer = {};
                                res.writeHead(200, { 'Content-Type': "application/json", 'Access-Control-Allow-Origin': '*' });
                                res.end(JSON.stringify(answer) + '\n\n');
                            }else{//Nick ok but pass not
                                var answer = {error: 'User registered with a different password'};
                                res.writeHead(400, { 'Content-Type': "application/json", 'Access-Control-Allow-Origin': '*' });
                                res.end(JSON.stringify(answer) + '\n\n');
                            }
                        }                    
                    });
                    if(flag){
                        const hashPass = crypto.createHash('md5').update(query.pass).digest('hex');
                        regData.users.push({nick: query.nick, pass: hashPass});
                        json = JSON.stringify(regData,null,4);
                        fs.writeFile(regFile, json, 'utf8', (err) =>{
                            if(err) throw err;
                            var answer = {};
                            res.writeHead(200, { 'Content-Type': "application/json", 'Access-Control-Allow-Origin': '*' });
                            res.end(JSON.stringify(answer) + '\n\n');
                            
                            //Add new player to the ranking
                            ranking.addPlayer(query["nick"]);
                        });
                    }
                }
            });
        }  
        catch(err) { /* erros de JSON */ } 
    })
    .on('error', (err) => { console.log(err.message); });
}

module.exports.doRegister = doRegister;
