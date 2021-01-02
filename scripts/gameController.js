 
 let configs;
 let gui;
 let game;
 
 const GROUP = "3";
 const URL = "http://twserver.alunos.dcc.fc.up.pt:8008/";
 const myUrl = "http://twserver.alunos.dcc.fc.up.pt:8103/";
//Color of the disks
const BLACK_DISK = "black";
const WHITE_DISK = "white";
const AVAILABLE_DISK = "available"
 
//Posible directions to search in the board
 
 const FORWARD = "forward";
 const BACKWARDS = "backwards";
 const UP = "up";
 const DOWN = "down";
 const UPPER_LEFT_DIAGONAL="uld";
 const DOWN_LEFT_DIAGONAL = "dld";
 const UPPER_RIGHT_DIAGONAL = "urd";
 const DOWN_RIGHT_DIAGONAL = "drd";
 const DONT_MOVE = "dontMove";

 //Class that defines the board where its possible to put disks
 class searchableBoard{
     constructor(){
        this.left = 2;
        this.bottom = 5;
        this.right = 5;
        this.top = 2; 

     }

     isInsideLimits(i,j){
        if(i>this.bottom || i<this.top) return false;
        if(j<this.left   || j>this.right) return false;
        return true;
    }

    changeBorders(i,j){
        if(i >=this.bottom && i < 7){
            this.bottom+=1;
        }
        if(i<=this.top && i >0){
            this.top-=1;
        }
        if(j<=this.left && j>0){
            this.left-=1;
        }
        if(j>=this.right && j<7){
            this.right+=1;
        }
    }

 }

//Class thah saves the number of disk that the player has, the color of the disks and if is able to play
 class Player{
     constructor(color){
         this.disks=2;
         this.diskColor=color;
         this.canPlay=true;
     }
     increaseDisks(){
         this.disks+=1;
     }
     decreaseDisks(){
         this.disks-=1;
     }

 };

//Class that has the positions coordinates,the end coordinates and the direction of a possible play
 class nextPositions{
     constructor(x,y,endX, endY,direction){
         this.direction = direction;
         this.x=x;
         this.y =y;
         this.endX = endX;
         this.endY = endY;
     }
 }

class GameControllerLocal{
    constructor(gui, conf){
        this.whiteDisksPlayer = new Player(WHITE_DISK);
        this.blackDisksPlayer = new Player(BLACK_DISK);
        this.configs = conf;
        this.currPlayer = this.blackDisksPlayer;
        this.nextPlayer = this.whiteDisksPlayer;
        this.computerPlayer;
        this.difficulty;
        this.gameState = gui.gameState;
        this.playState = gui.playState;
        this.restart = gui.restart;
        this.gameBoard = gui.gameBoard;
        this.nextAvailablePositions = [];
        this.searchableBoard = new searchableBoard();
            
        this.initConfigs();
        this.addHandlers();
        this.startGame();
    }

    initConfigs(){
        let computerPlayer = this.configs.computerPlayer;
        if(computerPlayer == WHITE_DISK){
            this.computerPlayer = WHITE_DISK;
        }
        else{
            this.computerPlayer =BLACK_DISK;
        }

        this.difficulty = this.configs.difficulty;
    }

    refreshSettings(){
        this.initConfigs();
        this.startGame();
    }
    
    startGame(){
        this.playState.changePlayerTurn(this.currPlayer.diskColor,true);        
        this.addDisk(3,3,this.whiteDisksPlayer);
        this.addDisk(4,4,this.whiteDisksPlayer);
        this.addDisk(3,4,this.blackDisksPlayer);
        this.addDisk(4,3,this.blackDisksPlayer); 
        
        this.getNextAvailablePosition(this.currPlayer);
        this.displayNextAvailable();  
        if(this.currPlayer.diskColor == this.computerPlayer){
            this.computerPlay();
        }
    }

//function that chooses a random possible move and simulates a click in that cell for the computer player
computerPlay(){
    let size = this.nextAvailablePositions.length;
    let rand = this.randomIntFromInterval(0, size-1);

    let cell = this.nextAvailablePositions[rand];
    if(size==0){
        this.unableToPlay();
        return;
    }
    setTimeout(() => {  this.onClick(cell); }, 500);
}

    randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
      }

    addHandlers(){
        this.playState.skipButton.addEventListener("click", this.skipTurn.bind(this));
        
        this.playState.giveUp.addEventListener("click", this.giveUp.bind(this));

        //Add click handlers to board cells
        for(var i=0; i<8; i++){
            for(var j=0; j<8; j++){
                let cell = this.gameBoard.gameView[i][j];
                let cellDOM = cell.getCellDOM();
                cellDOM.addEventListener("click",this.onClick.bind(this,cell));
            }
        }

    }
/*If the player does not have possible positions to play this function triggers the apropriate message and
  enables the player to skip is turn. It also checks if both players cant play and ends the game when it happens */
    unableToPlay(){
        
        if(this.currPlayer.canPlay=true || this.nextPlayer.canPlay == true)
            this.playState.unableToPlayMessage();
        if(this.currPlayer== this.computerPlayer){

            this.skipTurn();
        }
            this.currPlayer.canPlay=false;
        
        if(this.currPlayer.canPlay==false && this.nextPlayer.canPlay==false){
            this.endGame(false);
        }
        
    }
    giveUp(){
        this.endGame(true);
    }

//Functions that display the message of victory or defeat and enables the restart game button
    endGame(giveUp){
        let pc, player;
        let victory=false;
        if(this.computerPlayer == WHITE_DISK){
            pc = this.whiteDisksPlayer;
            player = this.blackDisksPlayer;
        }
        else{
            pc = this.blackDisksPlayer
            player = this.whiteDisksPlayer;
        }
        if(pc.disks > player.disks){
            victory=false;
        }
        else{
            victory = true;
        }
        if(giveUp){
            this.playState.giveUpMessage();
            victory = false;
        }
        else{
            this.playState.displayVictoryOrDefeat(victory);
        }

        this.gameBoard.board.style.setProperty("opacity", 0.2);

        this.updateClassifications(victory);

        this.restart.showRestartGame();
    
    }

    skipTurn(){
        this.changePlayerTurn();
        this.getNextAvailablePosition(this.currPlayer);
        this.displayNextAvailable(); 
    }
//Function that marks the next positions available to the player and displays it
    displayNextAvailable(){
        let gameView = this.gameBoard.gameView;
        let size = this.nextAvailablePositions.length;
       
        if(size==0){
            this.unableToPlay(); 
            return;
        }
        else{
            this.currPlayer.canPlay=true;
        } 
            
        for(var i=0; i<size; i++){
            let k = this.nextAvailablePositions[i].x;
            let j = this.nextAvailablePositions[i].y;
            let cell = gameView[k][j];
            cell.addDisk(AVAILABLE_DISK);
            cell.clickable=true;
        }
    }
    clearAvailablePositions(currX, currY){
        let size = this.nextAvailablePositions.length;
        let gameView = this.gameBoard.gameView;
        for(var i=0; i<size;i++){
            let x = this.nextAvailablePositions[i].x;
            let y = this.nextAvailablePositions[i].y;
            if(x != currX || y!= currY){
                gameView[x][y].addDisk("NotAvailable");
                gameView[x][y].clickable=false;
            }
        }

    }
    
   
    onClick(cellClicked){
        let i = cellClicked.x;
        let j = cellClicked.y;
        let gameView = this.gameBoard.gameView;

        if(gameView[i][j].clickable){
            
            this.turnOponentDisks(i,j);
            this.gameState.updateDiskState(this.whiteDisksPlayer.disks, this.blackDisksPlayer.disks);
            this.changePlayerTurn();
            this.clearAvailablePositions(i,j);
            this.getNextAvailablePosition(this.currPlayer);
            this.displayNextAvailable();
            
            if(this.currPlayer.diskColor == this.computerPlayer){
                this.computerPlay();
            }
        }

    }
    addDisk(i,j,currPlayer){
        let gameData = this.gameBoard.gameData;
        let color = currPlayer.diskColor;
        let cell = this.gameBoard.gameView[i][j];
        gameData[i][j] = color;
        cell.addDisk(color);
        cell.clickable=false;
        this.searchableBoard.changeBorders(i,j);
    }
    changePlayerTurn(){
        let temp = this.currPlayer;
        this.currPlayer=this.nextPlayer;
        this.nextPlayer = temp;
        let flag=true;

        if(this.currPlayer.diskColor == this.computerPlayer){            
            flag = false;
        }

        this.playState.changePlayerTurn(this.currPlayer.diskColor,flag);
    }

    getNextPositions(i,j){
        let size = this.nextAvailablePositions.length;
        let nextPositions=[];
        for(var k=0; k<size; k++){
            if(this.nextAvailablePositions[k].x == i && this.nextAvailablePositions[k].y == j){
                nextPositions.push(this.nextAvailablePositions[k]);
            }
        }
        return nextPositions;
    }
    
    turnOponentDisks(i,j){
        let gameData = this.gameBoard.gameData;
        let color = this.currPlayer.diskColor;
        let oponentPositions = this.getNextPositions(i,j);
        let direction;
        let moves;
        let endX,endY,opX,opY,x,y;
       
        for(var k=0; k<oponentPositions.length; k++){
            direction = oponentPositions[k].direction;
            moves =this.decideDirection(direction);
            endX = oponentPositions[k].endX;
            endY = oponentPositions[k].endY;
            opX = moves[0];
            opY = moves[1];
            x = Number(i);
            y = Number(j);

            while(x!=endX || y!=endY){
                if(gameData[x][y] ==this.nextPlayer.diskColor){
                      this.nextPlayer.decreaseDisks();
                  }  
                
                if(gameData[x][y] !=color){
                    this.addDisk(x,y,this.currPlayer);
                    this.currPlayer.increaseDisks();
                }
                if(opX != DONT_MOVE){
                    x+=opX;
                }
                if(opY != DONT_MOVE){
                    y+=opY;
                }
            }
        }
    }

   
    
//Function that searches the searchable board for the oponent disk and triggers a search starting in the oponent to check possible moves 
    getNextAvailablePosition(currPlayer){
        let gameData = this.gameBoard.gameData;
        let color = currPlayer.diskColor;
        this.nextAvailablePositions = [];
        let oponentColor;
        let positions = [];
        if( color == WHITE_DISK){
            oponentColor = BLACK_DISK;
        }
        else{
            oponentColor=WHITE_DISK;
        }

        for(var i=this.searchableBoard.top; i <=this.searchableBoard.bottom; i++){
            for(var j = this.searchableBoard.left; j<=this.searchableBoard.right; j++){
                var currColor = gameData[i][j];
                if(currColor == oponentColor){
                    let temp = this.lookAround(i,j,oponentColor);
                    positions = positions.concat(temp);
                }
            }

        }
        this.nextAvailablePositions = positions;

    }
   
    /* Function to determine if we increase/decrease the X cordinate or the Y cordinate
    or both in order to decide the direction to look for disks
    */

    decideDirection(direction){
        let opI,opJ;

        switch(direction){
            case FORWARD:
                opI=DONT_MOVE;
                opJ=1;
                break;
            case BACKWARDS:
                opI=DONT_MOVE;
                opJ=-1;
                break;
            case UP:
                opI=-1;
                opJ=DONT_MOVE;
                break;
            case DOWN:
                opI=1;
                opJ=DONT_MOVE;
                break;
            case UPPER_LEFT_DIAGONAL:
                opI=-1;
                opJ=-1;
                break;
            case DOWN_LEFT_DIAGONAL:
                opI=1;
                opJ=-1;
                break;
            
            case UPPER_RIGHT_DIAGONAL:
                opI=-1;
                opJ=1;
                break;
            case DOWN_RIGHT_DIAGONAL:
                opI=1;
                opJ=1;
                break;
        }

        let moves = [opI,opJ];
        return moves;

    }
//Function that searchs in a given direction to check is the play is possible
    lookAux(i,j,direction,oponentColor){
        let k=i;
        let l=j;
        let gameData = this.gameBoard.gameData;
        let moves = this.decideDirection(direction);
        let endX, endY,color,counter=0,nextCords;
        let foundOponent = false,foundCurr=false,invalid=false;
        let opI = moves[0];
        let opJ= moves[1];
      
        while(true){
            if(!this.searchableBoard.isInsideLimits(k,l)){
                if(k>7 || k <0 || l>7 || l<0){
                    invalid = false;
                    break;
                }
                invalid=true;
                break;
            }
            color = gameData[k][l];

            counter++;
            if(color == undefined){
                break;
            }
            else if(color == oponentColor){
                foundOponent = true;
            }
            else if(color != oponentColor && foundOponent){
                foundCurr=true;
                endX = k;
                endY = l;
            }


            if(opI!=DONT_MOVE){
                k+=opI;
            }
            if(opJ !=DONT_MOVE){
                l+=opJ;
            }
        }
        
    if(foundOponent && foundCurr && !invalid){
        nextCords = this.makeNextAvailablePosition(k,l,endX,endY,counter,opI,opJ,direction);

    }
    else{
         nextCords = new nextPositions(null,null,null,null,null);
    }

    return nextCords;

    }
//Function that triggers a search in every direction for possible moves
    lookAround(i, j ,oponentColor){
        let moves = [FORWARD,BACKWARDS,UP,DOWN,UPPER_RIGHT_DIAGONAL,DOWN_RIGHT_DIAGONAL,UPPER_LEFT_DIAGONAL,DOWN_LEFT_DIAGONAL];
        let positions = [];
        let invalid = new nextPositions(null,null,null,null,null);

        for(var k=0; k<moves.length; k++){
            let temp = this.lookAux(i,j,moves[k],oponentColor);
            if(!this.isEquals(temp,invalid)){
                positions.push(temp);
            }
        }
        return positions;
        
    }
//Function that creates a possible move
makeNextAvailablePosition(k,l,endX, endY,counter,opI,opJ,direction){
        let gameData = this.gameBoard.gameData;
        let nextI, nextJ;
        let nextCords;
        let invalid = false;
        while(true){
            if (opI != DONT_MOVE && opJ !=DONT_MOVE){
                nextI = k + (opI*-1)*counter;
                nextJ = l + (opJ*-1)*counter;
            }
            else  if(opI != DONT_MOVE){
                nextI = k + (opI*-1)*counter;
                nextJ = l;
            }
            else if(opJ != DONT_MOVE){
                 nextI= k;
                 nextJ = l + (opJ*-1)*counter;
            }

            if(!this.searchableBoard.isInsideLimits(nextI,nextJ)){
                invalid=true;
                break;
            }
            else if(gameData[nextI][nextJ]== undefined){
                break;
            }
            else if(gameData[nextI][nextJ] !=undefined){
                counter++;
            }
        } 

        if(!invalid){
            nextCords = new nextPositions(nextI,nextJ,endX,endY,direction);
        }
        else{

            nextCords = new nextPositions(null,null,null,null,null);
        }
        
        return nextCords;
    }


    isEquals(a, b){
        if(a.i != b.i || a.j != b.j || a.endX!= b.endX || a.endY!=b.endY ||  a.direction != b.direction){
            return false;
        }
        return true;
    }
  //Function to update the disks of each player and the empty cells
    updateClassifications(victory){
        const victorys = document.getElementById("victorys");
        const victoryNum = document.getElementById("victorys").textContent;
        const defeats = document.getElementById("defeats");
        const defeatsNum = document.getElementById("defeats").textContent;

        if(victory){
            let num = Number(victoryNum) +1 ;
            victorys.innerHTML=num;
        }
        else{
            let num = Number(defeatsNum) +1 ;
            defeats.innerHTML= num;
        }

    }
    
};

/* 
Class that controls the game play using the server
*/

class GameControllerServer{
    constructor(gui){
        this.nick;
        this.pass;
        this.color;
        this.opColor;
        this.board;
        this.count;
        this.turn;
        this.gameBoard = gui.gameBoard;
        this.gameState = gui.gameState;
        this.messageBoard = gui.playState;
        this.restart = gui.restart;
        this.logged=false;

        this.eventSource; 

        this.getUsersCreds();

        this.addClickHandlers();
        
        if(this.logged==true){
            this.initGame();
        }

    }

    getUsersCreds(){
        this.nick = usrNick;
        this.pass = passwd;

        if(this.nick == undefined || this.pass == undefined){
            alert("Tens de fazer login");
            this.logged = false;
        

        }
        else{
            this.logged=true;
        }
    }

    
     async initGame(){
         this.messageBoard.displayWaiting();
         
         let joinResponse;

         joinResponse = await this.join();

        if(joinResponse.ok){
            let data = await joinResponse.json();
            this.game = data["game"];
            if(data["color"] == "dark"){
                this.opColor=WHITE_DISK;
                this.color = BLACK_DISK;
            }
            else{
                this.color = WHITE_DISK;
                this.opColor = BLACK_DISK;
            }
            this.eventSource = this.ServerSentEvents();
        }
        else{
            alert("Erro de Join");
        }
    }

    async join(){
        let player = {
            group: GROUP,
            nick: this.nick,
            pass: this.pass
        }
        let playerJson  = JSON.stringify(player);
    
        let response = await fetch(myUrl+ "join", {
            method: 'POST',
            body: playerJson
        });
    
        return response;
        
    }   

      ServerSentEvents(){
        const url = URL + "update?" + "nick=" + this.nick + "&game=" + this.game;
        const urlSend = encodeURI(url);

        let eventSource = new EventSource(urlSend);
       
        eventSource.onopen = function(){
        }.bind(this);

        eventSource.onmessage = function(event){
            
            const data = JSON.parse(event.data);
            
            if("winner" in data){
                this.endGame(data);
            }
            else if("error" in data){
                alert(JSON.stringify(data));
            } 
            else if ("board" in data){
                this.updateBoard(data);
                this.updateCount(data);
                this.updateMessage(data); 
            }
            if("skip" in data){
                this.displaySkip(data);
               
            }
           
        }.bind(this);

        return eventSource;
    }
    
    updateBoard(data){

        let board = data["board"];
        if(board != undefined){

            for(var i=0; i<8; i++){
                for(var j=0; j<8;j++){
                    let cell = this.gameBoard.gameView[i][j];
                    let color = board[i][j];
                    let diskColor;
                    if(color == "dark") diskColor = BLACK_DISK;
                    if(color =="light") diskColor = WHITE_DISK;
    
                    if(diskColor==BLACK_DISK || diskColor == WHITE_DISK){
                        cell.addDisk(diskColor);
                    }
    
                }
        }
        }
}

    updateCount(data){
        let count = data["count"];

        let dark = count["dark"];
        let light = count["light"];

        this.gameState.updateDiskState(light,dark);

    }

    updateMessage(data){
        let player = data["turn"];
        if(player == this.nick){
            this.messageBoard.changePlayerTurn(this.color,true);
        }
        else{
            this.messageBoard.changePlayerTurn(this.opColor,false);
        }
    }

    displaySkip(data){
        let skip = data["skip"];
        let player = data["turn"];
        if(skip==true && player == this.nick){
            this.messageBoard.unableToPlayMessage();
        }
    }

    skipTurn(){
        //Send notify with move as null
        this.notify(-1,-1);
    }
  

   async endGame(data){
        let player = data["winner"];
        if(player !=null){
            if(player== this.nick){
                this.messageBoard.displayVictoryOrDefeat(true);
            }
            else if(player!=null){
                this.messageBoard.displayVictoryOrDefeat(false);
            }
            else{
                this.messageBoard.displayDraw();
            }
        }
        this.gameBoard.board.style.setProperty("opacity", 0.2);

        this.eventSource.close();
        this.restart.showRestartGame();

    }
    
    addClickHandlers(){
        //Click handlers for the board cells
        for(var i=0; i<8; i++){
            for(var j=0; j<8; j++){
                let cell = this.gameBoard.gameView[i][j];
                let cellDOM = cell.getCellDOM();
                cellDOM.addEventListener("click",this.onClick.bind(this,cell));
            }
        }

        //Click handler for the skip button
        this.messageBoard.skipButton.addEventListener("click", this.skipTurn.bind(this));
        //Click handler for the give up button
        this.messageBoard.giveUp.addEventListener("click", this.giveUp.bind(this));
    }

    async giveUp(){
        await this.leave();
           
    }

    async leave(){
        let player = {
            nick:this.nick, 
            pass:this.pass,
            game:this.game
        } 

        let playerJson = JSON.stringify(player);

        let response = await fetch(myUrl+"leave", {
            method: 'POST',
            body: playerJson
        });

        let data = await response.json();
    }

    async notify(i,j){
            let move;
      
         move ={
            nick: this.nick,
            pass: this.pass,
            game: this.game,
            move:{
                row:i,
                column:j
            }
        };

        if (i==-1 && j==-1){
            move={
                nick:this.nick,
                pass:this.pass,
                game:this.game,
                move: null
            }
        }

        let res = await fetch(URL + "notify",{
            method:'POST',
            body: JSON.stringify(move)
        });
        
        let data = await res.json();

    }
     async onClick(cellClicked){
        let i = parseInt(cellClicked.x);
        let j = parseInt(cellClicked.y);
        
        await this.notify(i,j);
    }

};


/*
Objects that create and update the Graphic User Interface
*/ 

//Class used in the game state, it display the number of disks passed as argument when is created
class DiskState{
    constructor(diskClass,parent,num){
        this.state = document.createElement("div");
        this.cell = document.createElement("div");
        this.disk = document.createElement("div");
        this.numDisks = document.createElement("div");
        this.numDisks.appendChild(document.createTextNode(num));
        
        this.state.className="diskState";
        this.cell.className="cell state";
        this.disk.className=diskClass;
        this.numDisks.className="numDiskState";
        
        this.cell.appendChild(this.disk);

        this.state.appendChild(this.cell);
        this.state.appendChild(this.numDisks);
        
        parent.appendChild(this.state);
    }
    updateValue(number){
       this.numDisks.replaceChild(document.createTextNode(number), this.numDisks.childNodes[0]);

    }
};

//Class to show messages to the player
class MessageBoard{
    constructor(parentId, startPlayer){
       this.parent = document.getElementById(parentId); 
       this.playing = document.createElement("div");
       this.playing.className = "messageBoard";
       this.text = document.createElement("div");
       this.text.appendChild(document.createTextNode("Turno de"));
       this.text.id="shiftText";
     
       this.disk = document.createElement("div");
       this.disk.id = "diskMessage";
       this.currDisk = document.createElement("div");
       this.currDisk.className = startPlayer;
     
       this.disk.appendChild(this.currDisk);
       
       this.playing.appendChild(this.text);
       this.playing.appendChild(this.disk);
       this.parent.appendChild(this.playing);
       this.skipButton = document.createElement("button");
       this.skipButton.id ="skipButton";
       this.skipButton.innerHTML="Passar jogada";

       this.giveUp = document.createElement("button");
       this.giveUp.innerHTML ="Desistir";
       this.giveUp.id="giveUpButton";
       this.playing.append(this.giveUp); 

       
    }

    changePlayerTurn(playerColor,myTurn){
        this.currDisk.className = playerColor;
        if(myTurn ==true){
            this.text.innerHTML = "Turno de (Eu)";
        }
        else{
            this.text.innerHTML = "Turno de (Op)";
        }

        let childNodes = this.playing.childNodes;
        this.playing.replaceChild(this.text, childNodes[0]);
        this.playing.replaceChild(this.disk, childNodes[1]);
        this.playing.append(this.giveUp); 

    }

    unableToPlayMessage(){
        this.message = document.createElement("div");
        this.message.innerHTML = "Sem jogadas possíveis";
        this.message.className="messageText";
        
        this.playing.replaceChild(this.message, this.playing.childNodes[0]);
        this.playing.replaceChild(this.skipButton, this.playing.childNodes[1]);
    }

    displayVictoryOrDefeat(victory){
        
        let numChilds = this.playing.childNodes.length;
        for(var i=0; i<numChilds; i++){
            this.playing.removeChild(this.playing.childNodes[0]);
        }
        this.message = document.createElement("div");
        this.message.className="messageText";
        if(victory){
            this.message.innerHTML = "Parabéns! Ganhaste o jogo";
        }
        else{
            this.message.innerHTML = "Perdeste o jogo";
        }
        
        this.playing.appendChild(this.message);
    }

    displayWaiting(){
        this.message = document.createElement("div");
        this.message.innerHTML = "Sem jogadas possíveis";
        this.message.innerHTML = "À espera de oponente"
        this.message.className="messageText";
        
        this.playing.replaceChild(this.message, this.playing.childNodes[0]);
        this.playing.removeChild(this.playing.childNodes[1])

    }

    displayDraw(){
        let numChilds = this.playing.childNodes.length;
        for(var i=0; i<numChilds; i++){
            this.playing.removeChild(this.playing.childNodes[0]);
        }

        this.message = document.createElement("div");
        this.message.className="messageText";
        this.message.innerHTML = "Empate";
        this.playing.appendChild(this.message);

    }

    giveUpMessage(){
        this.message = document.createElement("div");
        this.message.className="messageText";
        this.message.innerHTML = "Perdeste por desistência";
        let numChilds = this.playing.childNodes.length;
        for(var i=0; i<numChilds; i++){
            this.playing.removeChild(this.playing.childNodes[0]);
        }
        this.playing.appendChild(this.message);
       
    }
};

 //Class that builds the game board and saves data information and DOM properties for each cell in the board
 class GameBoard{
    constructor(parentId){
        this.parent = document.getElementById(parentId);
        this.board = document.createElement("div");
        this.board.className="board";
        this.table = document.createElement("table");

        this.gameView = new Array(8);
        this.gameData = new Array(8);
        for(var i=0; i<8; i++){
            this.gameData[i] = new Array(8);
            this.gameView[i] = new Array(8);
        }
        this.buildBoard();
        this.board.appendChild(this.table);
        this.parent.appendChild(this.board);
    }
        
        buildBoard() {
            for(var i=0; i<8; i++){
                let tr = document.createElement("tr");
                this.table.appendChild(tr);
                for(var j=0; j<8;j++){
                    let id = i.toString() + j.toString();
                    let cell = new Cell(id);
                    let cellDOM = cell.getCellDOM();
                    tr.appendChild(cellDOM);
                    this.gameData[i][j] = undefined;
                    this.gameView[i][j] = cell;
                }            
            }
        } 

};

//Class with a button to restart a game
class RestartGame{
    constructor(parentId){
        this.parent = document.getElementById(parentId);
        this.restart = document.createElement("button");
        this.restart.innerHTML="Jogar Novamente"
        this.restart.id="restartButton";
        this.parent.appendChild(this.restart);
        this.addHandlers();
    }

    showRestartGame(){
        this.restart.style.display = "inline";
        
    }

    addHandlers(){
        let restart = document.getElementById("restartButton");

        restart.addEventListener("click", ()=>{
            restartGame();
        });

    }

};

/*class to hold DOM information about each cellDOM in the game board */
class Cell{
    constructor(id){
        this.clickable = false;
        this.id=id;
        this.x = id.split("")[0];
        this.y = id.split("")[1];
        this.cellDOM = document.createElement("td");
        this.cellDOM.className= "cell";
        this.disk = document.createElement("div");
        this.cellDOM.appendChild(this.disk);
        this.cellDOM.id=id;
    }
    getCellDOM(){
        return this.cellDOM;
    }
    getId(){
        return this.id;
    }
    
    addDisk(color){
        this.disk.className = color;
    }
 
};
//Class tha holds information about the number of black and white disks and empty cells. It also display these values 
class GameState{
    constructor(parentId){
       this.blackDisks=0;
       this.whiteDisks=0;
       this.emptyCells=64;
       this.parent = document.getElementById(parentId);
       this.state = document.createElement("div");
       this.state.className="gameState";
       this.parent.appendChild(this.state);

       this.blackState = new DiskState(BLACK_DISK, this.state,this.blackDisks);
       this.whiteState = new DiskState(WHITE_DISK, this.state, this.whiteDisks);
       this.emptyState = new DiskState(null,this.state, this.emptyCells);
    }


    updateDiskState(valueWhite, valueBlack){
           
       this.whiteDisks = valueWhite;

       this.blackDisks=valueBlack;
       
       this.emptyCells= 64 - (this.blackDisks+this.whiteDisks);
       
       this.blackState.updateValue(this.blackDisks);
       this.whiteState.updateValue(this.whiteDisks);
       this.emptyState.updateValue(this.emptyCells);
   }

};



class BuildGUI{
    constructor(parentId){
        this.gameState  = new GameState(parentId);
        this.playState = new MessageBoard(parentId, BLACK_DISK );
        this.gameBoard = new GameBoard(parentId, this.onClick);
        this.restart   = new RestartGame(parentId);
    }
};


/*
Class that holds the game configuration
*/
class Configs{
    constructor(){
        this.computerPlayer = "white";
        this.playerVsComputer = true;
        this.playerVsPlayer = false;
        this.difficulty=1;
        this.defaultConfigs();
        this.addConfigHandlers();
    }

    defaultConfigs(){
      this.activeConfig("chooseBlackDisk");
      this.activeConfig("chooseVsComputer");
      this.activeConfig("chooseEasy");
    }
    //Change options to disabled color, that is light grey
    notActiveConfig(parentId){
        let parent = document.getElementById(parentId);
        let size = parent.childNodes.length;
        for(var i=0; i<size; i++){
            let element = parent.childNodes[i];
            if(element.className=="configText")
               element.style.backgroundColor="lightgrey";
        }
    }

    //Change option to the active color that is green
    activeConfig(elementId){
        let element = document.getElementById(elementId);
        element.style.backgroundColor= "green";
    }


    //Add click listeners to change the configuration
    addConfigHandlers(){
       let choosedWhiteDisk = document.getElementById("chooseWhiteDisk");
       
       let chooseBlackDisk = document.getElementById("chooseBlackDisk");

       let chooseVsComputer = document.getElementById("chooseVsComputer");

       let chooseVsPlayer = document.getElementById("chooseVsPlayer");


       chooseVsComputer.addEventListener("click", ()=>{
           this.playerVsComputer=true;
           this.playerVsPlayer = false;
           this.notActiveConfig("gameType");
           this.activeConfig("chooseVsComputer");
           refreshSettings();
       });

       chooseVsPlayer.addEventListener("click", () =>{
           this.playerVsComputer=false;
           this.playerVsPlayer = true;
           if(isLoged){
               this.notActiveConfig("gameType");
               this.activeConfig("chooseVsPlayer");
               refreshSettings();
           }
           else{
               alert("Tens de fazer login primeiro");
           }
       });


       
       chooseBlackDisk.addEventListener("click", ()=>{
           this.computerPlayer = WHITE_DISK;
           this.notActiveConfig("colorDisk");
           this.activeConfig("chooseBlackDisk");
           refreshSettings();
           
       } );

       choosedWhiteDisk.addEventListener("click", ()=>{
           this.computerPlayer = BLACK_DISK;
           this.notActiveConfig("colorDisk");
           this.activeConfig("chooseWhiteDisk");
           refreshSettings();
       }

       );

       let difficultyEasy = document.getElementById("chooseEasy");
       let difficultyMedium = document.getElementById("chooseMedium");
       let difficultyHard = document.getElementById("chooseHard");

       difficultyEasy.addEventListener("click", ()=>{
           this.difficulty=1;
           this.notActiveConfig("gameDifficulty");
           this.activeConfig("chooseEasy");
           refreshSettings();

       });
       difficultyMedium.addEventListener("click", ()=>{
           this.difficulty=2;
           this.notActiveConfig("gameDifficulty");
           this.activeConfig("chooseMedium");
           refreshSettings();

       });
       difficultyHard.addEventListener("click",()=>{
           this.difficulty=3;
           this.notActiveConfig("gameDifficulty");
           this.activeConfig("chooseHard");
           refreshSettings();
       });
    }

    
};

function removeGUI(){
    let gameObject = document.getElementById("gameBoard");
    let numChilds = gameObject.childNodes.length;
    let childNodes = gameObject.childNodes;
    for(var i=0; i<numChilds; i++){
        gameObject.removeChild(childNodes[0]);
    }

}
function restartGame(){
   refreshSettings();
}

function refreshSettings(){
    removeGUI();
    gui = new BuildGUI("gameBoard");


    if(configs.playerVsComputer){
        game =   new GameControllerLocal(gui,configs);
    }
    else if( configs.playerVsPlayer){
        game = new GameControllerServer(gui);
    }
}

window.onload = function () {
    configs = new Configs();
    gui = new BuildGUI("gameBoard");
    game = new GameControllerLocal(gui,configs);   
}
