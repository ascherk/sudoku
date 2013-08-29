// try to solve a sudoku by brute force / try and error
//
// check if number 'search' is present in box 'sudokuBox'
//

emptyCells = 0;



// Cell object
function Cell( box, row, col, value ) {

	this.box = box;
	this.row = row;
	this.col = col;

	this.solved = false;
	this.allowedValues = new Array();
	this.value = value;
	this.divId = '#' + row + '_' + col;

	if ( this.value >0 ) {
		this.solved = true;
	} else {
		this.solved = false;
	}	
		
	this.display = function () {
		if ( !this.solved ) {
			$(this.divId).html( '<p class="tiny">'+this.box+'/'+this.row+'/'+this.col+'</p>' + '<p class="content">'+this.allowedValues.join('/')+'</p>' );
		} else {
			$(this.divId).html( '<p class="tiny">'+this.box+'/'+this.row+'/'+this.col+'</p>' + '<p class="content">'+this.value+'</p>' );
		}
	}
		
	this.findAllowedValues = function(boxes, rows, cols ) {
		if ( !this.solved ) {
			for ( search = 1; search <= 9; search++ ) {
				if ( !foundInBox( boxes[ this.box ], search ) && !foundInRow( rows[this.row] , search ) && !foundInCol( cols[this.col] , search ) ) {
					this.allowedValues[this.allowedValues.length] = search; 
				}
			}
		}
	}
	
}

function Sudoku() {
	this.cells = new Array();
	// initialize here
	this.addCell = function( index, cell ) {
		this.cells[index] = cell;
	}
	
	// function to initialize
	this.paint = function() {
		//
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


// brute force attack on the sudoku
function bruteForce ( boxes, rows, cols ) {
	var iterations = 0;
	
	//while ( emptyCells > 0 && iterations < 1 ) {
		var counter = 0;
		var cellCounter = new Array(81);

		// iterate over every empty cell and try every digit. a cell is solved, if there
		// is only one possible digit
		for ( boxIndex = 0; boxIndex < boxes.length; boxIndex++) {
			for ( cellIndex = 0; cellIndex < 9; cellIndex++) {

				// content of the current cell
				var content = boxes[ boxIndex ][ cellIndex ];

				// id of the current <div>
				var id = '#' + boxIndex + '_' + cellIndex;

				// which row and column are we in?
				var row = Math.floor(cellIndex / 3)  + Math.floor( boxIndex / 3 ) * 3;
				var col = (cellIndex % 3) + ( boxIndex % 3 ) * 3;
				
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
		iterations++;
		console.log(iterations + ' iterations done');
	//}
}


// initially set all populated cells to green background
function colorMe (boxes) {
	for ( boxIndex = 0; boxIndex < boxes.length; boxIndex++) {
		for ( cellIndex = 0; cellIndex < 9; cellIndex++) {
			var row = Math.floor(cellIndex / 3)  + Math.floor( boxIndex / 3 ) * 3;
			var col = (cellIndex % 3) + ( boxIndex % 3 ) * 3;

			// content of the current cell
			var content = boxes[ boxIndex ][ cellIndex ];
			// id of the current <div>
			var id = '#' + row + '_' + col;

			// if the cell is empty try to brute force solve it;
			if ( content != 0 ) {
				$(id).addClass("greenInnerCell", 2500);
			} else {
				emptyCells++;
			}
		}
	}
	
	//console.log(emptyCells + ' cells are empty.');
}


$(document).ready( function(){

	var counter = 1;
	var outer = document.getElementById("outer");
	var html = outer.innerHTML;


	// initialize data structures: these are the 3x3 square boxes starting with index 0 at the top left 
	var boxes = [ 
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
	var rows = new Array(9);
	var cols = new Array(9);
	var cells = new Array(81);
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
			var id = row+'_'+col;
			rows[row][col] = content;
			cols[col][row] = content;
			cells[row*9+col] = new Cell(boxIndex, row, col, content);
			sudoku.addCell(row*9+col, new Cell(boxIndex, row, col, content));
			
			//html = html + '<div id="'+id+'" class="innerCell"><p class="id">' + id + ' / ' + row + ' / ' + col + '</p><p class="content">' + content + '</p></div>';
			html = html + '<div id="'+id+'" class="innerCell"><p class="content">' + '.' + '</p></div>';
			counter++;
		}
		html = html + '</div>';
	}

	outer.innerHTML = html;

	for (i=0;i<81;i++) {
		cells[i].findAllowedValues(boxes, rows, cols);
		cells[i].display();
	}
	
	// paint the cells with content green
	colorMe( boxes );

	/*
	for (i=0;i<9;i++) {
		console.log(rows[i].join());
	}
	console.log('#######################');
	for (i=0;i<9;i++) {
		console.log(cols[i].join());
	}
	*/

	// event 
	$("#button").click( function(){
		bruteForce( boxes, rows, cols );
	});

});



