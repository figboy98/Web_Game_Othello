
 /*class to hold DOM information about each cell in the game board */
 class Cell{
     constructor(id){
         this.cell = document.createElement("td");
         this.cell.className= "cell";
         this.placeHolder = document.createElement("div");
         this.cell.appendChild(this.placeHolder);
         this.cell.id=id;
     }
     getCellDOM(){
         return this.cell;
     }

     setDisk(color){
         this.placeHolder.className = color;
     }
  
 };
 
class GameBoard{
    constructor(){
        this.table = document.createElement("table");
        let div = document.getElementById("gameBoard");
        div.appendChild(this.table);
        this.cellDOM = new Array(8);
        this.cellData = new Array(8);
        for(var i=0; i<8; i++){
            this.cellDOM[i] = new Array(8);
            this.cellData[i] = new Array(8);
        }
        this.buildBoard();
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
                this.cellDOM[i][j] =cellDOM;
                this.cellData[i][j] = undefined;
            }
        }
    }

    getCellDOM(i,j){
        return this.cellDOM[i][j];
    }
};

class GameController{
    constructor(){
        this.gameBoard = new GameBoard();
        this.addClickHandler();
    }
    addDisk(color){
        this.className += color;

    }
    addClickHandler(){
        for(var i=0; i<8; i++){
            for(var j=0; j<8; j++){
                let cell = this.gameBoard.getCellDOM(i,j);
                cell.addEventListener("click", this.onClick);
            }
        }
    }

    onClick(){
        let element = document.getElementById(this.id);
        let placeHolder = element.childNodes[0];
        placeHolder.className = "white";
        
    }
};

window.onload = function () {
    let game = new GameController;
    
}
 


  