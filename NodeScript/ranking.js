const fs = require('fs').promises;
const path = require('path');


const RANKINGPATH = path.resolve(__dirname, 'ranking.json');

//Initial data for ranking
let rankingData =[ 
     {nick: "123", victories: 354, games: 627},
     {nick: "fig", victories: 354, games: 627},
     {nick: "a", victories: 276, games: 565},
     {nick: "tati123", victories: 252, games: 444},
     {nick: "admin", victories: 220, games: 318},
     {nick: "adeus", victories: 219, games: 350},
     {nick: "netcan", victories: 205, games: 414},
     {nick: "ola", victories: 201, games: 461},
     {nick: "Player 1", victories: 201, games: 372},
     {nick: "Player 2", victories: 183, games: 369},
     {nick: "duarte", victories: 144, games: 236} ];


const headers = {
    plain: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'        
    }
}

class Ranking{
         constructor(){
             this.players;
             this.init=false;
         }         
     
    async  initRanking(){
        try{
            this.players = await this.loadRanking();
            this.init=true;
        }
        catch(err){
            console.log(err);
        }
    }
     
    startRanking(){

        fs.appendFile(RANKINGPATH, JSON.stringify(rankingData,null,4), function(err){
            if(err){
                console.log(err);
            }
           
            } )
    };
        
    async  loadRanking(){
        try{
            let data = await fs.readFile(RANKINGPATH, 'utf8');
            return JSON.parse(data);
        }
        catch(err){
            console.log(err);
        }
    }
    async  writeToRanking(data){
        try{
            fs.writeFile(RANKINGPATH, JSON.stringify(data,null,4));
        }
        catch(err){
            console.log(err);
        }
    };

    async  addPlayer(name){
        if(!this.init) await this.initRanking();
        let newPlayer = {nick: name, victories:0, games:0};
        try{    
            this.players.push(newPlayer);
            this.writeToRanking(this.players);
        }
        catch(err){
            console.log(err);
        }

    };

    async  updateStats(name, win){
        if(!this.init) await this.initRanking();
        
        for(var player in this.players){
            if(this.players[player].nick == name){
                if(win === true){
                    this.players[player].victories +=1;
                }
                this.players[player].games +=1;
                break;
            }
        }

        this.players.sort((a,b) =>{
        return b.victories - a.victories
        });

        await this.writeToRanking(this.players);
    };

    async  getRanking(){
        if(!this.init) await this.initRanking();
        let topPlayers = []
        let players = this.players;
        for(var i=0; i<10; i++){
            topPlayers.push(players[i]);
        }

        return topPlayers;
    }

};

async function doGetRanking(request, response){
    let rank = new Ranking();
    let players = await  rank.getRanking();
    let json;
    let body='';

    request
    .on('data', (chunk) =>{body+=chunk})
    .on('end',() =>{
        try{
            JSON.parse(body);
            try{
                json = {
                    ranking: players
                };
                let answer = JSON.stringify(json);
                response.writeHead(200, headers["plain"]);
                response.write(answer + '\n\n');
                response.end();
            }
            catch(err){
                console.log(err);
                response.writeHead(500, headers["plain"]);
                response.write(JSON.stringify({error: "Internal error getting ranking"}));
                response.end();
            }
        
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

   
}
async function addPlayer(player){
    let rank = new Ranking();
    await rank.addPlayer(player);
}
async function updateStats(player, win){
    let rank = new Ranking();
    await rank.updateStats(player,win);
}
// async function startRanking(){
//     let rank = new Ranking();
//     await rank.startRanking();

// }
module.exports.doGetRanking = doGetRanking;
module.exports.addPlayer = addPlayer;
module.exports.updateStats = updateStats;
