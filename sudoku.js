// try to solve a sudoku by brute force / try and error
//

emptyCells = 0;

// Cell object
function Cell( index, box, row, col, value ) {

	this.box = box;
	this.row = row;
	this.col = col;
	this.index = index;

	this.allowedValues = new Array();

	this.solved = false;
	this.found = 0;
	this.value = value;
	this.divId = '#' + index;

	if ( this.value > 0 ) {
		this.solved = true;
	} else {
		this.solved = false;
	}	

	this.findAllowedValues = function(sudoku) {
		this.allowedValues = new Array();
		if ( !this.solved ) {
			for ( var search = 1; search <= 9; search++ ) {
				if ( !sudoku.findInBox( this.index, search, true ) && !sudoku.findInRow( this.index , search, true ) && !sudoku.findInCol( this.index , search, true ) ) {
					this.allowedValues[this.allowedValues.length] = search; 
				}
			}
			if (this.allowedValues.length == 1 ) {
				this.solved = true;
				this.found = 2;
				this.value = this.allowedValues[0];
			}
		}
		return this.found;
	}

	this.display = function () {
		var html = '<p class="tiny">i:'+this.index + '/b:' + this.box+'/r:'+this.row+'/c:'+this.col+'</p>' + '<p class="content">';
		if ( !this.solved ) {
			html = html +this.allowedValues.join('/');
		} else {
			html = html +this.value;
		}
		html = html + '</p>';
		$(this.divId).html(html);

		if ( this.solved ) {
			$(this.divId).removeClass("redInnerCell", 500);
			if ( this.found == 2 ) {
				$(this.divId).addClass("dropedInnerCell", 500);
			} else { 
				if (this.found == 1 ) {
					$(this.divId).addClass("solvedInnerCell", 500);
				} else {
					$(this.divId).addClass("yellowInnerCell", 500);
				}
			}
		} else {
			$(this.divId).addClass("redInnerCell", 1000);
		}
	}
}


// Sudoku object
//
function Sudoku() {
	this.cells = new Array();
	
	// add a cell
	this.addCell = function( index, cell ) {
		this.cells[index] = cell;
	}
	
	// function to paint the current status
	this.paint = function() {
		for ( var i=0; i<this.cells.length; i++ ) {
			this.cells[i].display();
		}
	}

	this.bruteForceCell = function( index ) {
		var currentCell = this.cells[ index ];
		//var box = this.boxes[ currentCell.box ];
		var av = currentCell.allowedValues;
		
		if ( av.length == 1 ) {
				this.cells[ index ].solved = true;
				this.cells[ index ].value = av[0];
				return true;
		}
		for ( var x=0; x < av.length; x++) {
			if ( !this.findInBox(index, av[x], false) || !this.findInRow(index, av[x], false) || !this.findInCol(index, av[x], false) ) {
				this.cells[ index ].solved = true;
				this.cells[ index ].found = 1;
				this.cells[ index ].value = av[x];
				return true;
			}
		}
		return false;
	}

	// brute force on the sudoku
	this.bruteForce = function () {
		
	}

	this.slice = function ( box ) {
		var boxArray = new Array();
		for ( var i=0; i<81;i++) {
			if ( this.cells[i].box == box ) {
				boxArray[boxArray.length] = this.cells[i];
			}
		}
		return boxArray;
	}

	this.findInBox = function( index, value, solved ) {
		var found = false;
		var startIndex = Math.floor( index / 9 ) * 9;

		var currentBox = this.cells[index].box;
		var boxArray = this.slice(currentBox);
		
		for ( var i = 0; i < 9; i++ ) {
			var c = boxArray[i];
			if ( c.index != index ) {
				//check only for already solved cells
				if ( solved ) {
					if ( c.solved ) {
						if ( c.value == value ) {
							return true;
						}
					}
				} else {
					if ( !c.solved ) {
						if ( c.allowedValues.indexOf(value) >= 0 ) {
							return true;
						}
					}
				}
			}
		}
		return found;
	}


	this.findInRow = function( index, value, solved ) {
		var found = false;
		var startIndex = Math.floor( index / 9 ) * 9;

		for ( var i = startIndex; i < startIndex + 9; i++ ) {
			var c = this.cells[i];
			if ( i != index ) {
				//check only for already solved cells
				if ( solved ) {
					if ( c.solved ) {
						if ( c.value == value ) {
							return true;
						}
					}
				} else {
					if ( !c.solved ) {
						if ( c.allowedValues.indexOf(value) >= 0 ) {
							return true;
						}
					}
				}
			}
		}
		return found;
	}


	this.findInCol = function( index, value, solved ) {
		var found = false;
		var startIndex = index % 9;

		for ( var i = startIndex; i < startIndex + 9*9; i +=9 ) {
			var c = this.cells[i];
			if ( i != index ) {
				//check only for already solved cells
				if ( solved ) {
					if ( c.solved ) {
						if ( c.value == value ) {
							return true;
						}
					}
				} else {
					if ( !c.solved ) {
						if ( c.allowedValues.indexOf(value) >= 0 ) {
							return true;
						}
					}
				}
			}
		}
		return found;
	}
}


// initialize data structures: these are the 3x3 square boxes starting with index 0 at the top left 
boxes = [ 
	[ 0,0,0,2,3,0,8,0,0 ] , 
	[ 5,0,0,0,0,0,0,0,0 ] , 
	[ 1,0,0,0,0,0,0,0,0 ] , 
	[ 0,0,0,3,0,0,0,0,0 ] , 
	[ 1,0,6,0,0,0,0,0,0 ] , 
	[ 5,0,0,0,0,0,0,4,0 ] , 
	[ 0,0,1,0,0,0,0,0,0 ] , 
	[ 0,0,0,4,8,0,0,3,0 ] , 
	[ 6,2,0,0,0,0,0,0,7 ] , 
]


boxes = [ 
	[ 0,4,0, 0,3,0, 6,0,0 ] , 
	[ 1,5,0, 0,6,0, 0,0,0 ] , 
	[ 0,8,3, 5,0,0, 0,0,9 ] , 

	[ 0,5,0, 1,0,0, 0,0,0 ] , 
	[ 0,1,0, 7,3,8, 0,0,0 ] , 
	[ 0,0,8, 0,0,2, 0,6,0 ] , 

	[ 5,0,0, 0,0,4, 8,6,0 ] , 
	[ 6,0,0, 5,8,0, 0,2,4 ] , 
	[ 0,0,4, 0,7,0, 0,9,0 ] , 
]

$(document).ready( function(){

	var counter = 1;
	var outer = document.getElementById("outer");
	var html = outer.innerHTML;


	var sudoku = new Sudoku();
	
	// draw the grid and populate the row/column arrays
	for ( var boxIndex = 0; boxIndex<9; boxIndex++) {
		html = html + '<div id="box'+boxIndex+'" class="outerCell">';
		
		for ( var cellIndex = 0; cellIndex<9; cellIndex++) {
			var row = Math.floor(cellIndex / 3)  + Math.floor( boxIndex / 3 ) * 3;
			var col = (cellIndex % 3) + ( boxIndex % 3 ) * 3;
			var content = boxes[boxIndex][cellIndex];
			var index = row*9+col;

			sudoku.addCell(index, new Cell( index, boxIndex, row, col, content));
			
			html = html + '<div id="'+index+'" class="innerCell"></div>';
		}
		html = html + '</div>';
	}

	outer.innerHTML = html;

	sudoku.paint();

	for (var i=0;i<81;i++) {
		sudoku.cells[i].findAllowedValues(sudoku);
	}
	
	sudoku.paint();

	// event 
	iii=0;
	$("#button").click( function() {
		iii++;
		console.log(iii);
		for ( var i=0; i<81;i++) {
			if ( sudoku.bruteForceCell(i) ) {
				for ( var nurSo = 1; nurSo < 20; nurSo++ ) {
					for (var i=0;i<81;i++) {
						sudoku.cells[i].findAllowedValues(sudoku);
					}
				}
				sudoku.paint();
			}
		}
	});
});

