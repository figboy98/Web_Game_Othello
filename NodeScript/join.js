
const crypto = require('crypto');
const { resolve } = require('path');

const DARK = "dark";
const LIGHT = "light";

const headers = {
    plain: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'        
    }
}


class Join{
    constructor(){
        this.queue = [];
        this.waiting=false;
    }

    joinPlayer(player){
        let newPlayer;
        
        if(!this.waiting){
            this.waiting = true;
            let gameHash = crypto.createHash('md5').update(String(Date.now())).digest('hex');
            let diskColor = DARK;
            newPlayer = {
                group : player["group"],
                nick: player["nick"],
                pass: player["pass"],
                game: gameHash,
                color: diskColor
            }
            this.queue.push(newPlayer);
        }
        else{
            this.waiting=false;
            let opponent = this.queue.shift();
            let gameHash = opponent["game"];
            let diskColor = LIGHT;
            
            newPlayer = {
                group: player["group"],
                nick: player["nick"],
                pass: player["pass"],
                game: gameHash,
                color: diskColor
            }

            //Informar update de emparelhamento

            
        }

        //Guardar informação deste jogo algures

        return newPlayer;
    }

    leavePlayer(player){
       let tmp = this.queue[0];
       if(tmp["game"] == player["game"] && tmp["nick"] == player["nick"] && tmp["pass"] == player["pass"]){
           this.queue.shift();
           this.waiting = false;
           return true;
       }
       return false;
    }
};






let join = new Join();



function doJoin(request, response){

    let playerInfo;
    let body = '';
    
    request
    .on('data', (chunk) =>{body+=chunk})
    .on('end',() =>{
        try{
            playerInfo = JSON.parse(body);
            let info = join.joinPlayer(playerInfo);
            let answer = {
                game: info["game"],
                color: info["color"]
            }
            response.writeHead(200,headers["plain"]);
            response.write(JSON.stringify(answer) + '\n\n');
            response.end();
        }
        catch(error){
            console.log(error.message);
            response.writeHead(400, headers["plain"]);
            response.write(JSON.stringify({error: "Error parsing JSON request: " + error + "."}));
            response.end();
            return;
        }
    })
    .on('error',(err)=>{
        console.log(err);
        response.writeHead(400, headers["plain"]);
        response.write(JSON.stringify(err));
        response.end();
        return;
    })
};

function leave(player){
    return join.leavePlayer(player);

};

function isPairing(){
    if (join.waiting) return true;
    return false; 
}

module.exports.doJoin = doJoin;
module.exports.leave = leave;
module.exports.isPairing =isPairing;

