const join = require('./join');

const headers = {
    plain: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'        
    }
}

function doLeave(request, response){
    let body='';
    let player;
    let json = {};
    
    request
    .on('data', (chunk) =>{body+=chunk})
    .on('end',() =>{
        try{
            player = JSON.parse(body);
            if(join.isPairing() == true){
                join.leave(player);
            } 
            else{
                join.endGame(player);
                // Broadcast update of give up

            }
            response.writeHead(200,headers["plain"]);
            response.end(JSON.stringify(json));
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

module.exports.doLeave = doLeave;