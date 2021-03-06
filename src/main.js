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
            if(typeof parent.visual != "undefined"){
                parent.visual.append(this.visual);
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
            this.setElemAttributes({'viewBox':'0 0 98 240'});
			this.tiles = new Array(10);
			for(var i=0; i<10; i++){
				this.tiles[i]=new Array(24);
			}			
            for(var i=0; i<10; i++){
                for(var j=0; j<24; j++){
					this.tiles[i][j]= new Tile((10*i),(10*j));
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
			this.indexX = 
			this.setElemAttributes({'x': this.x, 'y': this.y});			
        }

        addTo(parent){
			super.displayElement(parent);
			
        }
    }    

	// gameElements which are placed at the top 

	class GameElement {
		constructor(center){
			this.center = center;
			this.blocks = new Array(4);
			for(var i=0; i< this.blocks.length; i++){
				this.blocks[i]= new Block();
			}
		}
 /*-------------------- Utility -------------------------*/
		minX(){
			var min=this.blocks[1].x;			
			for(var i=0; i<this.blocks.length; i++){
				if(this.blocks[i].x< min){
					min = this.blocks[i].x;
				}
			}
			return min;
		}

		maxX(){
			var max=this.blocks[1].x;
			for(var i=0; i<this.blocks.length; i++){
				if(this.blocks[i].x> max){
					max = this.blocks[i].x;
				}
			}
			return max;
		}

		maxY(){
			var max=this.blocks[1].y;
			for(var i=0; i<this.blocks.length; i++){
				if(this.blocks[i].y> max){
					max = this.blocks[i].y;
				}
			}
			return max;
		}

		addTo(parent){            
            for(var i=0; i< this.blocks.length; i++){
                this.blocks[i].addTo(parent);                
            }            
		}
		
		Occupy(field){
			for(var i=0; i<this.blocks.length; i++){
				var j, k;
				j = this.blocks[i].x/10;
				k = this.blocks[i].y/10;
				if(!field.tiles[j][k].occupied){
					field.tiles[j][k].changeOccupation();
				}								
			}
		}

		deOccupy(field){
			for(var i=0; i<this.blocks.length; i++){
				var j, k;
				j = this.blocks[i].x/10;
				k = this.blocks[i].y/10;
				if(field.tiles[j][k].occupied){
					field.tiles[j][k].changeOccupation();	
				}								
			}
		}
		
/*-------------------- Position change -------------------------*/
		moveDown(field){
			if(this.maxY()<230){
				var passed = true;
				if(typeof field!="undefined"){
					this.deOccupy(field);
					for(var i=0; i< this.blocks.length; i++){
						var j, k;
						j = this.blocks[i].x/10;
						k = (this.blocks[i].y + 10)/10;
						if(field.tiles[j][k].occupied){
							passed = false;
							let event = new Event('stopMovement', {bubbles:true});
							this.blocks[i].visual.dispatchEvent(event);
						}
					}
					this.Occupy(field);					
				}
				if(passed){
					this.center.y=this.center.y+10;
					if(typeof field!="undefined"){
						this.deOccupy(field);
					}
					for(var i=0; i<this.blocks.length; i++){
						this.blocks[i].setPosition(this.blocks[i].x, (this.blocks[i].y+10));
					}
					if(typeof field!="undefined"){
						this.Occupy(field);
					}
				}
			}
        }
        
        moveLeft(){				
			if(this.minX()-10>=0){
				this.center.x= this.center.x-10;
            	for(var i=0; i<this.blocks.length; i++){								
					this.blocks[i].setPosition((this.blocks[i].x-10), this.blocks[i].y);			
				}
			}            
        }

        moveRight(){
			if(this.maxX()<=80){
				this.center.x = this.center.x+10;			
            	for(var i=0; i<this.blocks.length; i++){												
					this.blocks[i].setPosition((this.blocks[i].x+10), this.blocks[i].y);
				}  
			}         
		}

		rotate(){
			var newCords=[];						
            for(var i=0; i< this.blocks.length; i++){
				var x = this.blocks[i].x;
				var y = this.blocks[i].y;
				var deltaX = (x - this.center.x);
				var deltaY = (y - this.center.y);				
				if(deltaY!=0){
					y-=deltaY;
					x-=deltaY;						
				} 
				if(deltaX!=0){
					x-=deltaX;
					y+=deltaX;
				}
				newCords.push({'x':x,'y':y});				
			}			
			var passed = true;			
			for(var i=0; i<newCords.length; i++){
				var elem = newCords[i];
				if(elem.x<0 || elem.x>90 || elem.y<0 || elem.y>230){
					passed = false;
				}
			}			
			if(passed===true){
				for(var i=0; i<this.blocks.length; i++){
					this.blocks[i].setPosition(newCords[i].x, newCords[i].y);
				}
			}			
        }	
	}
	/*-------------------- Tertis blocks types -------------------------*/
    class LineElement extends GameElement{
        constructor(center){
            super(center);
			for(var i=-1; i<this.blocks.length-1; i++){                
                this.blocks[i+1].setPosition((center.x + i*10), center.y);                
            }            
        }                
	}
	
	class zigRight extends GameElement{
		constructor(center){
			super(center);
			var x, y;
			x=1;
			y=0;
			for(var i=0; i<this.blocks.length; i++){
				if(i===0 || i%2 === 0 ){
					this.blocks[i].setPosition((center.x + x*10), (center.y+ y*10));
					x--;
				}else{
					this.blocks[i].setPosition((center.x + x*10), (center.y + y*10));
					y++;
				}
			}
		}
	}

	class zigLeft extends GameElement{
		constructor(center){
			super(center);
			var x, y;
			x=-1;
			y=0;
			for(var i=0; i<this.blocks.length; i++){
				if(i===0 || i%2 === 0 ){
					this.blocks[i].setPosition((center.x + x*10), (center.y+ y*10));
					x++;
				}else{
					this.blocks[i].setPosition((center.x + x*10), (center.y + y*10));
					y++;
				}
			} 
		}
	}

	class Square extends GameElement{
		constructor(center){
			super(center);
			var x, y;
			x=0;
			y=0;
			for(var i=0; i<this.blocks.length; i++){
				if(i===0 || i%2 === 0 ){
					this.blocks[i].setPosition((center.x + x*10), (center.y+ y*10));
					x++;
				}else{
					this.blocks[i].setPosition((center.x + x*10), (center.y + y*10));
					y++;
					x--;
				}
			}
		}
		rotate(){
			return 0;
		}
	}

	class RL extends GameElement{
		constructor(center){
			super(center);
			var x, y;
			x=-1;
			y=-1;
			for(var i=0; i<this.blocks.length; i++){
				if(i===0 ){
					this.blocks[i].setPosition((center.x + x*10), (center.y+ y*10));					
					y++;
				}else{
					this.blocks[i].setPosition((center.x + x*10), (center.y + y*10));
					x++;
				}
			}
			this.moveDown();
		}		
	}

	class LL extends GameElement{
		constructor(center){
			super(center);
			var x, y;
			x=1;
			y=-1;
			for(var i=0; i<this.blocks.length; i++){
				if(i===0 ){
					this.blocks[i].setPosition((center.x + x*10), (center.y+ y*10));					
					y++;
				}else{
					this.blocks[i].setPosition((center.x + x*10), (center.y + y*10));
					x--;
				}
			}
			this.moveDown();
		}		
	}

    /*--------------------Main Code-------------------------*/
    var center = {'x':40, 'y': 0}; // the blocks would append at this point left top angle

    var field= new GameField();
    field.displayElement(d.getElementById('container'));
	var elementInFocus  = randomizeBlocks();
	elementInFocus.addTo(field);

	/*-------------------- Utilities -------------------------*/
	function randomizeBlocks(){
		var index = Math.floor((Math.random() * 6));
		switch(index){
			case 0: 
				return new LineElement(center);
			case 1:
				return new zigRight(center);
			case 2:
				return new zigLeft(center);
			case 3:
				return new Square(center);
			case 4:
				return new RL(center);
			case 5:
				return new LL(center);
		}
	}


	/*--------------------Controls-------------------------*/
	w.addEventListener('keydown', function(){
		// s char code
		if(this.event.which === 83 ){
			elementInFocus.moveDown(field);
		// a char code
		}else if(this.event.which === 65){
			elementInFocus.moveLeft();
		// d char code
		}else if(this.event.which === 68){
			elementInFocus.moveRight();
		// w char code 87
		}else if(this.event.which === 87){
			elementInFocus.rotate();
		}
		
	});
	/*------------------End of Controls----------------------*/
	w.addEventListener('stopMovement', function(){
		console.log('Event worked');
	}) 
})(window, document)
