
async function updateRanking(){
    let data = await ranking();
    removeRanking();
    let rank = data["ranking"];

    let size = rank.length;
    startRanking();
    for(var i=0; i<size; i++){
        let nick = rank[i]["nick"];
        let victorys = rank[i]["victories"];
        let games = rank[i]["games"];
        addPlayer(nick,victorys,games);
    }

}
function startRanking(){
    let parent = document.getElementById("classifications");
    let header = document.createElement("div");
    header.className="rankLine";
    let nick = document.createElement("div");
    nick.innerHTML="Nick";
    nick.className="rank";

    let victories = document.createElement("div");
    victories.innerHTML="Vitórias";
    victories.className="rank";

    let games = document.createElement("div");
    games.innerHTML="Jogos";
    games.className="rank";

    header.appendChild(nick);
    header.appendChild(victories);
    header.appendChild(games);

    parent.appendChild(header);

}
function removeRanking(){
    let parent = document.getElementById("classifications");
    let size = parent.childElementCount;

    for(var i=0; i<size;i++){
        parent.removeChild(parent.lastElementChild);
    }
}
function addPlayer(nick, victories, games){
    let parent = document.getElementById("classifications");
    let line = document.createElement("div");
    line.className="rankLine";
    let nickEl =document.createElement("div");
    nickEl.innerHTML=nick;
    nickEl.className="rank";

    let victoriesEl =document.createElement("div");
    victoriesEl.innerHTML=victories;
    victoriesEl.className="rank";
    
    let gamesEl =document.createElement("div");
    gamesEl.innerHTML=games;
    gamesEl.className="rank";
    
    line.appendChild(nickEl);
    line.appendChild(victoriesEl);
    line.appendChild(gamesEl);
    parent.appendChild(line);

}
async function ranking(){
    let rankData = await fetch(URL+"ranking",{
        method:'POST',
        body:JSON.stringify({})
    });

    let data = await rankData.json();

    return data
}