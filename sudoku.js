// try to solve a sudoku by brute force / try and error
//
// check if number 'search' is present in box 'sudokuBox'
//

emptyCells = 0;



// Cell object
function Cell( index, box, row, col, value ) {

	this.box = box;
	this.row = row;
	this.col = col;
	this.index = index;

	this.solved = false;
	this.value = value;
	this.divId = '#' + row + '_' + col;

	if ( this.value > 0 ) {
		this.solved = true;
	} else {
		this.solved = false;
	}	

	this.findAllowedValues = function(boxes, rows, cols ) {
		this.allowedValues = new Array();
		if ( !this.solved ) {
			for ( search = 1; search <= 9; search++ ) {
				if ( !foundInBox( boxes[ this.box ], search ) && !foundInRow( rows[this.row] , search ) && !foundInCol( cols[this.col] , search ) ) {
					this.allowedValues[this.allowedValues.length] = search; 
				}
			}
		}
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
			$(this.divId).removeClass("redInnerCell", 2500);
			$(this.divId).addClass("yellowInnerCell", 2500);
		} else {
			$(this.divId).addClass("redInnerCell", 1000);
		}
	}
}


// Sudoku object
//
function Sudoku() {
	this.cells = new Array();
	this.cols = new Array();
	this.rows = new Array();
	this.boxes = new Array();
	
	// add a cell
	this.addCell = function( index, cell ) {
		this.cells[index] = cell;
	}
	
	// function to paint the current status
	this.paint = function() {
		for (i=0; i<this.cells.length; i++ ) {
			this.cells[i].display();
		}
	}


	this.update = function( boxes, rows, cols ) {
		this.rows = rows;
		this.cols = cols;
		this.boxes = boxes;
	}

	this.bruteForceCell = function( index ) {
		var currentCell = this.cells[ index ];
		var row = this.rows[ currentCell.row ];
		var col = this.cols[ currentCell.col ];
		var box = this.boxes[ currentCell.box ];
		var av = currentCell.allowedValues;
		
		for ( x=0; x < av.length; x++) {
			console.log('value to search:'+x+'/'+av[x]);
			if (!this.findInRow(index, av[x], false) || !this.findInCol(index, av[x], false) ) {
				this.cells[ index ].solved = true;
				this.cells[ index ].value = av[x];
				cols[row] = av[x];
				rows[col] = av[x];
				return true;
			}
		}
		return false;
	}

	// brute force attack on the sudoku
	this.bruteForce = function () {
		
		var counter = 0;
		var cellCounter = new Array(81);

		// iterate over every empty cell and try every digit. a cell is solved, if there
		// is only one possible digit
		for ( boxIndex = 0; boxIndex < boxes.length; boxIndex++) {
			for ( cellIndex = 0; cellIndex < 9; cellIndex++) {

				// content of the current cell
				var content = boxes[ boxIndex ][ cellIndex ];


				// which row and column are we in?
				var row = Math.floor(cellIndex / 3)  + Math.floor( boxIndex / 3 ) * 3;
				var col = (cellIndex % 3) + ( boxIndex % 3 ) * 3;

				// id of the current <div>
				var id = '#' + row + '_' + col;
				
				// if the cell is empty try to brute force solve it;
				if ( content != 0 ) {
					//console.log(content);
					cellCounter[ counter ] = 1;
				} else {
					cellCounter[ counter ] = 0;
					// cell is empty
					$(id).addClass("redInnerCell", 1000);
					bc = bruteForceCell( boxes, boxIndex, cellIndex, rows[row], cols[col] );
					//if (  bc != "" ) {
					if (  bc != -1 ) {
						console.log('heureka ' +id + '/' + bc );
						rows[row][col] = bc;
						cols[col][row] = bc;
						boxes[boxIndex][cellIndex] = bc;
						$(id).removeClass("redInnerCell");
						$(id).addClass("solvedInnerCell");
						$(id).html('<p class="content">'+bc+'</p>');
					}
				}
			}
		}
	}


	this.findInRow = function( index, value, solved ) {
		var found = false;
		var startIndex = Math.floor( index / 9 ) * 9;
		console.log( index+'/'+startIndex);

		for ( i = startIndex; i < startIndex + 9; i++ ) {
			c = this.cells[i];
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
							console.log("row ja");
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
		console.log( index+'/'+startIndex);

		for ( i = startIndex; i < startIndex + 9*9; i +=9 ) {
			c = this.cells[i];
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
							console.log("col ja");
							return true;
						}
					}
				}
			}
		}
		return found;
	}


}


function foundInBox ( sudokuBox, search ) {
	for ( index = 0; index < 9; index++ ) {
		if ( sudokuBox[ index ] == search ) {
			//console.log('found ' + search + ' at ' + index );
			return true;
		}
	}
	return false;
}


function foundInRow ( sudokuRow, search ) {
	for ( index = 0; index < 9; index++ ) {
		if ( sudokuRow[ index ] == search ) {
			//console.log('found ' + search + ' at ' + index );
			return true;
		}
	}
	return false;
}

function foundInCol ( sudokuCol, search ) {
	for ( index = 0; index < 9; index++ ) {
		if ( sudokuCol[ index ] == search ) {
			//console.log('found ' + search + ' at ' + index );
			return true;
		}
	}
	return false;
}


function bruteForceCell ( boxes, boxIndex, cellIndex, row, col ) {

	var allowedContentCounter = 0;
	var allowedContent = "";

	for ( search = 1; search <= 9; search++ ) {
		if ( !foundInBox( boxes[ boxIndex ], search ) && !foundInRow( row , search ) && !foundInCol( col , search ) ) {
			allowedContentCounter++;
			//allowedContent = allowedContent + search + ' / '; 
			allowedContent = search; 
		}
	}

	//return allowedContent;

	if ( allowedContentCounter == 1 ) {
		return allowedContent;
	} else { 
		return -1;
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

	// initialize arrays for rows and columns
	rows = new Array(9);
	cols = new Array(9);


$(document).ready( function(){

	var counter = 1;
	var outer = document.getElementById("outer");
	var html = outer.innerHTML;


	var sudoku = new Sudoku();
	
	for ( i = 0; i<9; i++) {
		rows[i] = new Array(9);
		cols[i] = new Array(9);
	}

	// draw the grid and populate the row/column arrays
	for ( boxIndex = 0; boxIndex<9; boxIndex++) {
		html = html + '<div id="'+boxIndex+'" class="outerCell">';
		
		for ( cellIndex = 0; cellIndex<9; cellIndex++) {
			var row = Math.floor(cellIndex / 3)  + Math.floor( boxIndex / 3 ) * 3;
			var col = (cellIndex % 3) + ( boxIndex % 3 ) * 3;
			var content = boxes[boxIndex][cellIndex];
			var id = row + '_' + col;
			var index = row*9+col;

			rows[row][col] = content;
			cols[col][row] = content;
			
			//cells[index] = new Cell(index, boxIndex, row, col, content);
			
			sudoku.addCell(index, new Cell( index, boxIndex, row, col, content));
			
			html = html + '<div id="'+id+'" class="innerCell"></div>';
		}

		html = html + '</div>';
	}

	outer.innerHTML = html;

	for (i=0;i<81;i++) {
		sudoku.cells[i].findAllowedValues(boxes, rows, cols);
		//sudoku.cells[i].display();
	}
	
	sudoku.update( boxes, rows, cols );
	sudoku.paint();

	// event 
	$("#button").click( function() {
		if ( sudoku.bruteForceCell(65) ) {
			for (i=0;i<81;i++) {
				sudoku.cells[i].findAllowedValues(boxes, rows, cols);
			}
			sudoku.paint();
		}

		if ( sudoku.bruteForceCell(69) ) {
			for (i=0;i<81;i++) {
				sudoku.cells[i].findAllowedValues(boxes, rows, cols);
			}
			sudoku.paint();
		}
			
	});

});

