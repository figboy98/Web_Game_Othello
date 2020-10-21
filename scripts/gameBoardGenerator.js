
 /*class to hold DOM information about each cellDOM in the game board */
 class Cell{
     constructor(id){
         this.cellDOM = document.createElement("td");
         this.cellDOM.className= "cellDOM";
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
 
class GameBoard{
    constructor(){
        let gameBoard = document.getElementById("gameBoard");
        this.table = document.createElement("table");
        gameBoard.appendChild(this.table);
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
            let tr = document.createElement("tr");
            this.table.appendChild(tr);
            for(var j=0; j<8;j++){
                let id = i.toString() + j.toString();
                let cell = new Cell(id);
                let cellDOM = cell.getCellDOM();
                tr.appendChild(cellDOM);
                this.cell[i][j] =cell;
                this.cellData[i][j] = undefined;
            }
        }
    }
    getCell(i,j){
        return this.cell[i][j];

    }
    getCellDOM(i,j){
        if(arguments==1){
            let temp = Number(id);
            let i = temp%10;
            temp/=10;
            let j = temp%10; 
        }
        let cell = this.cell[i][j];
        let cellDOM = cell.getCellDOM();
        return cellDOM;
    }
};

class GameController{
    constructor(){
        this.gameBoard = new GameBoard();
        this.addClickHandler();
    }
    addClickHandler(){
        for(var i=0; i<8; i++){
            for(var j=0; j<8; j++){
                let cellDOM = this.gameBoard.getCellDOM(i,j);
                let cell = this.gameBoard.getCell(i,j);
                cellDOM.addEventListener("click", this.onClick.bind(this, cell));
            }
        }
    }
    onClick(cell){
        this.addDisk("white", cell);
    }
    addDisk(color,cellDOM){
        let element = this.gameBoard.getCellDOM(cell.id);
        element.addDisk(color);
                                
    }
};

window.onload = function () {
    let game = new GameController;
    
}
 


  