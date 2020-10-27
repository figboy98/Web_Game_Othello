
 let LEFT = 2;
 let BOTTOM = 5;
 let RIGHT = 5;
 let TOP = 2;
 let NEXT_PLAYER = "white";
 let CURR_PLAYER = "black";
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
     constructor(x,y,direction){
         this.direction = direction;
         this.x=x;
         this.y =y;
     }
 }
 

class GameBoard{
    constructor(){
        let gameBoard = document.getElementById("gameBoard");
        this.table = document.createElement("table");
        gameBoard.appendChild(this.table);
        this.nextAvailablePositions = [];
        this.gameView = new Array(8);
        this.gameData = new Array(8);
        for(var i=0; i<8; i++){
            this.gameData[i] = new Array(8);
            this.gameView[i] = new Array(8);
        }
        this.buildBoard();
        this.initBoard();
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
                cellDOM.addEventListener("click",this.onClick.bind(this,cell));
                this.gameData[i][j] = undefined;
                this.gameView[i][j] = cell;
            }
        }
    }

    initBoard(){

        /*this.addDisk(3,2,WHITE_DISK);
        this.addDisk(3,3,BLACK_DISK);
        this.addDisk(3,4,WHITE_DISK);
        this.addDisk(2,2,WHITE_DISK);
        this.addDisk(2,3,WHITE_DISK);
        this.addDisk(2,4,WHITE_DISK);
        this.addDisk(4,3,WHITE_DISK);
        this.addDisk(4,4,WHITE_DISK);
        this.addDisk(3,1,WHITE_DISK);
        this.addDisk(1,5,WHITE_DISK);
        this.addDisk(4,2,WHITE_DISK);
        this.addDisk(5,3,WHITE_DISK); */
        this.addDisk(3,3,WHITE_DISK);
        this.addDisk(4,4,WHITE_DISK);
        this.addDisk(3,4,BLACK_DISK);
        this.addDisk(4,3,BLACK_DISK); 
        this.getNextAvailablePosition(CURR_PLAYER);
        this.displayNextAvailable();
        

    }

    displayNextAvailable(){
        let size = this.nextAvailablePositions.length;
        for(var i=0; i<size; i++){
            
            let k = this.nextAvailablePositions[i].x;
            let j = this.nextAvailablePositions[i].y;
            let cell = this.gameView[k][j];
            cell.addDisk(AVAILABLE_DISK);
            cell.clickable=true;
        }
    }
    clearAvailablePositions(currX, currY){
        var size = this.nextAvailablePositions.length;
        if(size==0) alert("clear");
        for(var i=0; i<size;i++){
            let x = this.nextAvailablePositions[i].x;
            let y = this.nextAvailablePositions[i].y;
            if(x != currX || y!= currY){
                this.gameView[x][y].addDisk("NotAvailable");
                this.gameView[x][y].clickable=false;
            }
        }

    }
    
   
    onClick(cellClicked){
        let i = cellClicked.x;
        let j = cellClicked.y;

        if(this.gameView[i][j].clickable){
            this.addDisk(i,j,CURR_PLAYER);
            this.turnOponentDisks(i,j);
            this.changePlayerTurn();
            this.clearAvailablePositions(i,j);
            this.getNextAvailablePosition(CURR_PLAYER);
            this.displayNextAvailable();
        }

    }
    changePlayerTurn(){
        let temp = CURR_PLAYER;
        CURR_PLAYER=NEXT_PLAYER;
        NEXT_PLAYER = temp;
    }
    getNextPosition(i,j){
        let size = this.nextAvailablePositions.length;
        for(var k=0; k<size; k++){
            if(this.nextAvailablePositions[k].x == i && this.nextAvailablePositions[k].y == j){
                return this.nextAvailablePositions[k];
            }
        }
    }
    //NOTE: ------------------------Change this to a switch---------------------------------------------- 
    
    turnOponentDisks(i,j){
        let position = this.getNextPosition(i,j);
        let direction = position.direction;

        if(direction == FORWARD){
            j++;
            while(this.gameData[i][j] !=CURR_PLAYER){
                this.gameView[i][j].addDisk(CURR_PLAYER);
                this.gameData[i][j] = CURR_PLAYER;
                j++;
            }
        }
        if(direction == BACKWARDS){
            j--;
            while(this.gameData[i][j] !=CURR_PLAYER){
                this.gameView[i][j].addDisk(CURR_PLAYER);
                this.gameData[i][j] = CURR_PLAYER;

                j--;
            }
        }

        if(direction == UP){
            i--;
            while(this.gameData[i][j] !=CURR_PLAYER){
                this.gameView[i][j].addDisk(CURR_PLAYER);
                this.gameData[i][j] = CURR_PLAYER;

                i--;
            }
        }

        if(direction== DOWN){
            i++;
            while(this.gameData[i][j] !=CURR_PLAYER){
                this.gameView[i][j].addDisk(CURR_PLAYER);
                this.gameData[i][j] = CURR_PLAYER;

                i++;
            }
        }
        if(direction == UPPER_LEFT_DIAGONAL){
            i--;
            j--;
            while(this.gameData[i][j] !=CURR_PLAYER){
                this.gameView[i][j].addDisk(CURR_PLAYER);
                this.gameData[i][j] = CURR_PLAYER;
                i--;
                j--;
            }
        }
        if(direction == DOWN_LEFT_DIAGONAL){
            i++;
            j--;
            while(this.gameData[i][j] !=CURR_PLAYER){
                this.gameView[i][j].addDisk(CURR_PLAYER);
                this.gameData[i][j] = CURR_PLAYER;
                i++;
                j--;
            }
        }
        if(direction == UPPER_RIGHT_DIAGONAL){
            i--;
            j++;
            while(this.gameData[i][j] !=CURR_PLAYER){
                this.gameView[i][j].addDisk(CURR_PLAYER);
                this.gameData[i][j] = CURR_PLAYER;
                i--;
                j++;
            }
        }
        if(direction == DOWN_RIGHT_DIAGONAL){
            i++;
            j++;
            while(this.gameData[i][j] !=CURR_PLAYER){
                this.gameView[i][j].addDisk(CURR_PLAYER);
                this.gameData[i][j] = CURR_PLAYER;
                i++;
                j++;
            }
        }

    }

    addDisk(i,j,color){
        let cell = this.gameView[i][j];
        this.gameData[i][j] = color;
        cell.addDisk(color);
        this.changeBorders(i,j);
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

    getNextAvailablePosition(color){
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
                var currColor = this.gameData[i][j];
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
        let moves = this.decideDirection(direction);
        let nextI,nextJ,color,counter=0,nextCords;
        let foundOponent = false,foundCurr=false,invalid=false;
        let opI = moves[0];
        let opJ= moves[1];
      
        while(true){
            if(!this.isInsideLimits(k,l)){
                invalid=true;
                break;
            }
            color = this.gameData[k][l];

            counter++;
            if(color == undefined){
                break;
            }
            else if(color == oponentColor){
                foundOponent = true;
            }
            else if(color != oponentColor && foundOponent){
                foundCurr=true;
            }


            if(opI!=DONT_MOVE){
                k+=opI;
            }
            if(opJ !=DONT_MOVE){
                l+=opJ;
            }
        }
        
    if(foundOponent && foundCurr && !invalid){
        nextCords = this.makeNextAvailablePosition(k,l,counter,opI,opJ,direction);

    }
    else{
         nextCords = new nextPositions(null,null,null);
    }

    return nextCords;

    }

    makeNextAvailablePosition(k,l,counter,opI,opJ,direction){
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
            if(this.gameData[nextI][nextJ]== undefined){
                break;
            }
            else if(!this.isInsideLimits(nextI,nextJ)){
                invalid=true;
                break;
            }
            else if(this.gameData[nextI][nextJ] !=undefined){
                counter++;
            }
        } 

        if(!invalid){
            nextCords = new nextPositions(nextI,nextJ,direction);
        }
        else{

            nextCords = new nextPositions(null,null,null);
        }
        
        return nextCords;
    }


    isEquals(a, b){
        if(a.i != b.i || a.j != b.j || a.direction != b.direction){
            return false;
        }
        return true;
    }
   lookAround(i, j ,oponentColor){
        let moves = [FORWARD,BACKWARDS,UP,DOWN,UPPER_RIGHT_DIAGONAL,DOWN_RIGHT_DIAGONAL,UPPER_LEFT_DIAGONAL,DOWN_LEFT_DIAGONAL];
        let positions = [];
        let invalid = new nextPositions(null,null,null);

        for(var k=0; k<moves.length; k++){
            let temp = this.lookAux(i,j,moves[k],oponentColor);
            if(!this.isEquals(temp,invalid)){
                positions.push(temp);
            }
        }
        return positions;
       
       /*
        //Look forward

         for(var k=j; k<=RIGHT; k++){
            let color = this.gameData[i][k];
            if(color == undefined) break;
            else if (color == oponentColor) counter++;
            else if(color != oponentColor){
                counter++
                let nextX = i;
                let nextY = k - counter;
                let nextAvailable = new nextPositions(nextX,nextY,FORWARD);
                if(nextX <0 || nextX >7 || nextY <0 || nextY >7) break;
                if(this.gameData[nextX][nextY]==undefined)
                    positions.push(nextAvailable);
                break;
            } 
        } */
        
    }
    
};

class GameController{
    constructor(){
        this.gameBoard = new GameBoard();
    }
       
 
};

window.onload = function () {
    let game = new GameController;
    
}
 


  