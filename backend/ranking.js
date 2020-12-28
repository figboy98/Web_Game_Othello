const fs = require('fs').promises;

const RANKINGPATH = '../dataBase/Ranking.json';

// let rankingData =[ 
//      {nick: "123", victories: 354, games: 627},
//      {nick: "fig", victories: 354, games: 627},
//      {nick: "a", victories: 276, games: 565},
//      {nick: "tati123", victories: 252, games: 444},
//      {nick: "admin", victories: 220, games: 318},
//      {nick: "adeus", victories: 219, games: 350},
//      {nick: "netcan", victories: 205, games: 414},
//      {nick: "ola", victories: 201, games: 461},
//      {nick: "Player 1", victories: 201, games: 372},
//      {nick: "Player 2", victories: 183, games: 369},
//      {nick: "duarte", victories: 144, games: 236} ];

module.exports = class Ranking{
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
        fs.appendFile('../dataBase/Ranking.json', JSON.stringify(rankingData), function(err){
            if(err){
                console.log(err);
            }
            else{
                console.log("writed" + data);
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
            fs.writeFile(RANKINGPATH, JSON.stringify(data));
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
            writeToRanking(data);
        }
        catch(err){
            console.log(err);
        }

    };

    async  updateStats(name, win){
        if(!this.init) await this.initRanking();
        for(player in this.players){
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

        await writeToRanking(this.players);
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
