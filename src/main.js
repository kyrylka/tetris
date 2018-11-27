(function(w,d){
    
    // object which holds the info about the absract cords of the gameField
    class Tile {
        constructor(x, y){
            this.x = x;
            this.y = y;
            this.occupied = false;
        }

        changeOccupation(){
            if(this.occupied===true){
                this.occupied=false;
            }else{
                this.occupied=true;
            }
        }
    } 
    
    // object which renders the elements on the screen

    class HtmlConstructor{
        constructor(type){
            this.visual = d.createElementNS('http://www.w3.org/2000/svg', type);                        
        }

        setElemAttributes(attrs){
            for(var keys in attrs){
                this.visual.setAttribute(keys, attrs[keys]);
            }
        }

        displayElement(parent){            
            if(typeof parent === "undefined" && typeof this.parent != "undefined"){
                this.parent.visual.append(this.visual);
            }else if(typeof parent!= "undefined"){
                parent.append(this.visual);
            }else{
                throw "Parent is not defined";   
            }            
        }
    }
    class GameField extends HtmlConstructor{
        constructor(){
            super('svg');
            this.setElemAttributes({'viewBox':'0 0 100 240'});
			this.tiles = new Array(10);
			for(var i=0; i<10; i++){
				this.tiles[i]=new Array(24);
			}			
            for(var i=0; i<10; i++){
                for(var j=0; j<24; j++){
					this.tiles[i][j]= new Tile((10*i+5),(10*j+5));
				}
			}			
        }    
    }    
    class Block extends HtmlConstructor{
        constructor(){
            super('rect');
            this.setElemAttributes({'width': 8, 'height': 8, 'style': 'fill: rgb(0,0,0); stroke:rgb(0,0,0)'});            
        }

        setPosition(x, y){			
			this.x = x;
			this.y = y;  
			this.setElemAttributes({'x': this.x, 'y': this.y});			
        }

        addTo(parent){
            this.parent = parent;
            super.displayElement(); 
        }
    }    

	// gameElements which are placed at the top 

	class GameElement {
		constructor(){
			this.blocks = new Array(4);
			for(var i=0; i< this.blocks.length; i++){
				this.blocks[i]= new Block();
			}
		}

		moveDown(){
			for(var i=0; i<this.blocks.length; i++){
				this.blocks[i].setPosition(this.blocks[i].x, (this.blocks[i].y+10));
			}
        }
        
        moveLeft(){
            if(this.blocks[i].x-10 >0){
                for(var i=0; i<this.blocks.length; i++){				
				    this.blocks[i].setPosition((this.blocks[i].x-10), this.blocks[i].y);
                }
            }
        }

        moveRight(){
            if(this.blocks[i].x+10<=235){
                for(var i=0; i<this.blocks.length; i++){				
				    this.blocks[i].setPosition((this.blocks[i].x+10), this.blocks[i].y);
                }
            }
        }
    }
    class LineElement extends GameElement{
        constructor(center){
            super();
            var j=-1;
            for(var i=0; i<this.blocks.length; i++){                
                this.blocks[i].setPosition((center.x + j*10), center.y);                
                j++;
            }
            console.log(this);
        }
        
        rotate(){
            for(var i=0; i< this.blocks.length; i++){
                var j=i-1;

            }
        }

        addTo(parent){            
            for(var i=0; i< this.blocks.length; i++){
                this.blocks[i].addTo(parent);                
            }            
        }
    }

    /*--------------------Main Code-------------------------*/
    var center = {'x':55, 'y': 5}; // the blocks would append at this point

    var field= new GameField();
    field.displayElement(d.getElementById('container'));
    var test = new LineElement(center); 
    var test2 = new Block();
    test2.addTo(field);
    test.addTo(field);          
})(window, document)
