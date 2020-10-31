
 let LEFT = 2;
 let BOTTOM = 5;
 let RIGHT = 5;
 let TOP = 2; 
 let BLACK_DISK = "black";
 let WHITE_DISK = "white";
 let AVAILABLE_DISK = "available"
 let FORWARD = "forward";
 let BACKWARDS = "backwards";
 let UP = "up";
 let DOWN = "down";
 let UPPER_LEFT_DIAGONAL="uld";
 let DOWN_LEFT_DIAGONAL = "dld";
 let UPPER_RIGHT_DIAGONAL = "urd";
 let DOWN_RIGHT_DIAGONAL = "drd";
 let DONT_MOVE = "dontMove";
 

 class GameState{
    constructor(parentId){
       this.blackDisks=0;
       this.whiteDisks=0;
       this.emptyCells=64;
       this.parent = document.getElementById(parentId);
       this.state = document.createElement("div");
       this.state.className="gameState";
       this.parent.appendChild(this.state);

       this.blackState = new DiskState(WHITE_DISK, this.state,this.blackDisks);
       this.whiteState = new DiskState(BLACK_DISK, this.state, this.whiteDisks);
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

 class DiskState{
     constructor(diskClass,parent,num){
         this.state = document.createElement("div");
         this.cell = document.createElement("div");
         this.disk = document.createElement("div");
         this.numDisks = document.createElement("div");
         this.numDisks.appendChild(document.createTextNode(num));
         
         this.state.className="diskState";
         this.cell.className="cell";
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

 class MessageBoard{
    constructor(parentId, startPlayer){
       this.parent = document.getElementById(parentId); 
       this.playing = document.createElement("div");
       this.playing.className = "messageBoard";
       this.text = document.createElement("div");
       this.text.appendChild(document.createTextNode("Turno de"));
       this.disk = document.createElement("div");
       this.disk.className = "diskMessage";
       this.currDisk = document.createElement("div");
       this.currDisk.className = startPlayer;
       this.disk.appendChild(this.currDisk);
       
       this.playing.appendChild(this.text);
       this.playing.appendChild(this.disk);
       this.parent.appendChild(this.playing);
       this.skipButton = document.createElement("button");
       this.skipButton.innerHTML="Passar jogada";

       this.giveUp = document.createElement("button");
       this.giveUp.innerHTML ="Desistir";
       this.giveUp.id="giveUpButton";
       this.playing.append(this.giveUp); 

       
    }

    changePlayerTurn(playerColor){
        this.temp = document.createElement("div");
        this.temp.className=playerColor;
        this.disk.replaceChild(this.temp, this.disk.childNodes[0]);
    }

    unableToPlayMessage(){
        this.message = document.createElement("div");
        this.message.innerHTML = "Sem jogadas possíveis";
        
        this.playing.replaceChild(this.message, this.playing.childNodes[0]);
        this.playing.replaceChild(this.skipButton, this.playing.childNodes[1]);
    }
    displayVictoryOrDefeat(victory){

        this.message = document.createElement("div");
        if(victory){
            this.message.innerHTML = "Parabéns! Ganhaste o jogo";
        }
        else{
            this.message.innerHTML = "Perdeste o jogo";
        }
        this.playing.replaceChild(this.message, this.playing.childNodes[0]);
        this.playing.removeChild(this.playing.childNodes[1]);
    }

    giveUpMessage(){
        this.message = document.createElement("div");
        this.message.innerHTML = "Perdeste por desistência";
        this.playing.replaceChild(this.message, this.playing.childNodes[0]);
        this.playing.removeChild(this.playing.childNodes[1]);

    }
};


 

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

 class nextPositions{
     constructor(x,y,endX, endY,direction){
         this.direction = direction;
         this.x=x;
         this.y =y;
         this.endX = endX;
         this.endY = endY;
     }
 }
 
class GameBoard{
    constructor(parentId, clickFunction){
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
        this.buildBoard(clickFunction);
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

class GameController{
    constructor(parentId){
        this.whiteDisksPlayer = new Player(WHITE_DISK);
        this.blackDisksPlayer = new Player(BLACK_DISK);
        
        this.currPlayer = this.blackDisksPlayer;
        this.nextPlayer = this.whiteDisksPlayer;
        
        this.gameState = new GameState(parentId);
        this.playState = new MessageBoard(parentId, this.currPlayer.diskColor );
       
        this.gameBoard = new GameBoard(parentId, this.onClick);
        
        this.nextAvailablePositions = [];
        


        this.computerPlayer= this.whiteDisksPlayer.diskColor;

        this.gameState.updateDiskState(this.whiteDisksPlayer.disks, this.blackDisksPlayer.disks);
        
        this.addHandlers();

        this.startGame();
    }

    
    startGame(){
        this.addDisk(3,3,this.whiteDisksPlayer);
        this.addDisk(4,4,this.whiteDisksPlayer);
        this.addDisk(3,4,this.blackDisksPlayer);
        this.addDisk(4,3,this.blackDisksPlayer); 
        
        this.getNextAvailablePosition(this.currPlayer);
        this.displayNextAvailable();  
        if(this.currPlayer == this.computerPlayer){
            let cell = this.computerPlay();
            this.onClick(cell);
        }
    }

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

        
        for(var i=0; i<8; i++){
            for(var j=0; j<8; j++){
                let cell = this.gameBoard.gameView[i][j];
                let cellDOM = cell.getCellDOM();
                cellDOM.addEventListener("click",this.onClick.bind(this,cell));
            }
        }

    }


    unableToPlay(){
        
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
    endGame(giveUp){
        let player1, player2;
        let victory=false;
        if(this.computerPlayer.diskColor == WHITE_DISK){
            player1 = this.whiteDisksPlayer;
            player2 = this.blackDisksPlayer;
        }
        else{
            player1 = this.blackDisksPlayer
            player2 = this.whiteDisksPlayer;
        }
        if(player1.disks > player2.disks){
            victory=false;
        }
        else{
            victory = true;
        }
        if(giveUp){
            this.playState.giveUpMessage();
        }
        else{
            this.playState.displayVictoryOrDefeat(victory);
        }
        this.gameBoard.board.style.setProperty("opacity", 0.2);
    }

    skipTurn(){
        this.changePlayerTurn();
        this.getNextAvailablePosition(this.currPlayer);
        this.displayNextAvailable(); 
    }
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
        this.changeBorders(i,j);
    }
    changePlayerTurn(){
        let temp = this.currPlayer;
        this.currPlayer=this.nextPlayer;
        this.nextPlayer = temp;

        this.playState.changePlayerTurn(this.currPlayer.diskColor);
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

   
    changeBorders(i,j){
        if(i >=BOTTOM && i < 7){
            BOTTOM +=1;
        }
        if(i<=TOP && i >0){
            TOP-=1;
        }
        if(j<=LEFT && j>0){
            LEFT-=1;
        }
        if(j>=RIGHT && j<7){
            RIGHT+=1;
        }
    }

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

        for(var i=TOP; i <= BOTTOM; i++){
            for(var j = LEFT; j<=RIGHT; j++){
                var currColor = gameData[i][j];
                if(currColor == oponentColor){
                    let temp = this.lookAround(i,j,oponentColor);
                    positions = positions.concat(temp);
                }
            }

        }
        this.nextAvailablePositions = positions;

    }
    isInsideLimits(i,j){
        if(i>BOTTOM || i<TOP) return false;
        if(j<LEFT || j>RIGHT) return false;
        return true;
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
            if(!this.isInsideLimits(k,l)){
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

            if(!this.isInsideLimits(nextI,nextJ)){
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
    
};

window.onload = function () {
    let game = new GameController("gameBoard");
    
}
 


  