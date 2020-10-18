
 class Cell{
     constructor(parentId){
         this.cell = document.createElement("div");
         var cellClass = "cell";
         this.cell.className= cellClass;
         let parent = document.getElementById(parentId);
         parent.appendChild(this.cell);
     }
     getCellDom(){
         return this.cell;
     }
  
 };
 
class GameBoard{
    constructor(){
        this.cell = new Array(8);
        this.cellData = new Array(8);
        for(var i=0; i<8; i++){
            this.cell[i] = new Array(8);
            this.cellData[i] = new Array(8);
        }
        this.buildBoard();



    }
    buildBoard() {
        for(var i=0; i<8; i++){
            for(var j=0; j<8;j++){
                let cell = new Cell("gameBoard");
                let cellDom = cell.getCellDom();
                cellDom.addEventListener("click", this.clickHandler);
                this.cell[i][j] = cell;
                this.cellData[i][j] = undefined;
            }
        }

    }
    clickHandler(){
        alert(this.className);

    }
};

class GameController{
    constructor(){
        this.gameBoard = new GameBoard();
    }
}

window.onload = function () {
    let game = new GameBoard();
    
}
 


  