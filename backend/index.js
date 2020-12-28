const rank = require('./ranking.js');

const ranking = new rank();




async function getRanking(){
    let players = await ranking.getRanking();
     console.log(players);
    }
    
    getRanking();