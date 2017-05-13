import { Component, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { UserComponent } from './user/user.component';
import { ChatComponent } from './components/chat/chat.component';
declare var Events: any;

interface ITile {
	bug: string;
	color: string;
};

interface ICell {
	row: number;
	col: number;
	tiles: ITile[];
};

interface IBoard {
	rows: number;
	cols: number;
	parity: boolean;
	cells: ICell[];
};

interface IBoardState {
	board: IBoard;
};

interface IServerGameMsg {
	tag: string;
	contents: IBoardState;
};

@Component({
	selector: 'hive-app',
 	templateUrl: './app.component.html',
 	providers: [ChatComponent]
})

export class AppComponent  {
	@ViewChild(ChatComponent)
	private chatComponent: ChatComponent;
	serverGameMsg: IServerGameMsg;

	rebuild_chrome_hack: number = 0;
	sampleChildData: string = '';
	placement_xy = {x: 0, y: 0};

	name: string = 'Hive';
	size: number = 50;

//	height: number = this.size * 2;
//	width: number = Math.sqrt(3)/2 * this.height;
//	vert: number = this.height * 3/4;
//	horiz: number = this.width;

	width: number = this.size * 2;
	height: number = Math.sqrt(3)/2 * this.width;
	horiz: number = this.width * 3/4;
	vert: number = this.height;

	// create grid of center points for the hexagons based on the canvas area
	canvas_width: number = 1400;
	canvas_height: number = 1200;
	canvas_rows: number = Math.floor(this.canvas_height / this.vert) - 1;
	canvas_cols: number = Math.floor(this.canvas_width / this.horiz) - 1;
	start_x: number = this.horiz/2 + 20;
	start_y: number  = this.vert/2 + 10;
	center_xy: object;

    // get the element with the #hiveCanvas on it
    @ViewChild("hiveCanvas") hiveCanvas: ElementRef; 

	// array of hive bug data
	hiveBugs = [
		{
			src: "http://www.polarlight.com/hexagons/hive-queen-black.png",
			color: "black",
			type: "queen"
		},
		{
			src: "http://www.polarlight.com/hexagons/hive-beetle-black.png",
			color: "black",
			type: "beetle"
		},
		{
			src: "http://www.polarlight.com/hexagons/hive-ant-black.png",
			color: "black",
			type: "ant"
		},
		{
			src: "http://www.polarlight.com/hexagons/hive-grasshopper-black.png",
			color: "black",
			type: "grasshopper"
		},
		{
			src: "http://www.polarlight.com/hexagons/hive-spider-black.png",
			color: "black",
			type: "spider"
		},
		{
			src: "http://www.polarlight.com/hexagons/hive-queen-white.png",
			color: "white",
			type: "queen"
		},
		{
			src: "http://www.polarlight.com/hexagons/hive-beetle-white.png",
			color: "white",
			type: "beetle"
		},
		{
			src: "http://www.polarlight.com/hexagons/hive-ant-white.png",
			color: "white",
			type: "ant"
		},
		{
			src: "http://www.polarlight.com/hexagons/hive-grasshopper-white.png",
			color: "white",
			type: "grasshopper"
		},
		{
			src: "http://www.polarlight.com/hexagons/hive-spider-white.png",
			color: "white",
			type: "spider"
		}
	];

	// an array of images 
	images = [];

	// an array of bugs on the board
	hiveBoardState = [
		{id: 0,  type: 'queen',       color: 'black', x: 0,  y: 0, z: 0, highlight: false},
		{id: 1,  type: 'spider',      color: 'black', x: 1,  y: 0, z: 0, highlight: false},
		{id: 2,  type: 'spider',      color: 'black', x: 2,  y: 0, z: 0, highlight: false},
		{id: 3,  type: 'beetle',      color: 'black', x: 3,  y: 0, z: 0, highlight: false},
		{id: 4,  type: 'beetle',      color: 'black', x: 4,  y: 0, z: 0, highlight: false},
		{id: 5,  type: 'grasshopper', color: 'black', x: 5,  y: 0, z: 0, highlight: false},
		{id: 6,  type: 'grasshopper', color: 'black', x: 6,  y: 0, z: 0, highlight: false},
		{id: 7,  type: 'grasshopper', color: 'black', x: 7,  y: 0, z: 0, highlight: false},
		{id: 8,  type: 'ant',         color: 'black', x: 8,  y: 0, z: 0, highlight: false},
		{id: 9,  type: 'ant',         color: 'black', x: 9,  y: 0, z: 0, highlight: false},
		{id: 10, type: 'ant',         color: 'black', x: 10, y: 0, z: 0, highlight: false},
		{id: 11, type: 'queen',       color: 'white', x: 0,  y: 1, z: 0, highlight: false},
		{id: 12, type: 'spider',      color: 'white', x: 1,  y: 1, z: 0, highlight: false},
		{id: 13, type: 'spider',      color: 'white', x: 2,  y: 1, z: 0, highlight: false},
		{id: 14, type: 'beetle',      color: 'white', x: 3,  y: 1, z: 0, highlight: false},
		{id: 15, type: 'beetle',      color: 'white', x: 4,  y: 1, z: 0, highlight: false},
		{id: 16, type: 'grasshopper', color: 'white', x: 5,  y: 1, z: 0, highlight: false},
		{id: 17, type: 'grasshopper', color: 'white', x: 6,  y: 1, z: 0, highlight: false},
		{id: 18, type: 'grasshopper', color: 'white', x: 7,  y: 1, z: 0, highlight: false},
		{id: 19, type: 'ant',         color: 'white', x: 8,  y: 1, z: 0, highlight: false},
		{id: 20, type: 'ant',         color: 'white', x: 9,  y: 1, z: 0, highlight: false},
		{id: 21, type: 'ant',         color: 'white', x: 10, y: 1, z: 0, highlight: false}		
	];
	currentSelectedId: number = -1;

	hex_corner(center, size, i) {
	    var angle_deg = 60 * i;
	    var angle_rad = Math.PI / 180 * angle_deg;
	    var point = {x: 0, y: 0};
	    point.x = center.x + size * Math.cos(angle_rad);
	    point.y = center.y + size * Math.sin(angle_rad);	
	    return point;
	};

	drawHexagon(id, ctx, center, size, fillStyle, highlight, dashedLine) {
		var point = this.hex_corner(center, size, 0);

		ctx.fillStyle = fillStyle;
		ctx.beginPath();
		ctx.moveTo(point.x, point.y);

		for (var n = 1; n < 6; n++) {
			var point = this.hex_corner(center, size, n);
			ctx.lineTo(point.x, point.y);
		}

		ctx.closePath();
	    ctx.lineWidth = 3;
	    if (dashedLine) {
		    ctx.setLineDash([5, 10]);
		} else {
			ctx.setLineDash([]);
		}
		if (fillStyle) {
			ctx.fillStyle = fillStyle;
			ctx.fill();
		}
	    ctx.strokeStyle = highlight ? 'red' : 'black';
	    ctx.stroke();
	};

	labelPiece(ctx, label, color, x, y){
		ctx.font = "16pt Calibri";
		ctx.fillStyle = (color === 'white' ? "#99ff33" : "#ff0066");
		ctx.fillText(label, x, y);
	};

	drawHiveBug(ctx, imgHiveBug, leftMostXCoor, highestYCoor, polyWidth, polyHeight) {
		ctx.drawImage(imgHiveBug, leftMostXCoor, highestYCoor, polyWidth, polyHeight);
	};

	// draw a Hive bug of a given type and color at a location
	drawHiveBugPiece(ctx, id, type, color, location) {
		var bug = this.hiveBugs.find(function(bug) {
			return bug.color === color && bug.type === type;
		});
		if (bug) {
			var image = this.images.find(function(image) {
				return image.src.includes(bug.color) && image.src.includes(bug.type);
			});
			if (image) {
				var state;
				state = this.hiveBoardState.find(function(state) {
					return state.id === id;
				});

			    var htmlColor = (color === 'black' ? '#f2f2f2' : '#8c8c8c');
				this.drawHexagon(id, ctx, location, this.size, htmlColor, state.highlight, false);
				this.drawHiveBug(ctx, image, location.x - 50 , location.y - 52, 100, 100);
				this.labelPiece(ctx, id.toString(), color, location.x + 20, location.y + 10);
			}
		} else {
			console.log("ERROR! Could not find bug of type " + type + " and color = " + color + "\n");
		}
	};

	writeMessage(ctx, message){
		ctx.font = "18pt Calibri";
		ctx.fillStyle = "black";
//		ctx.fillText(message, 500, 25);
	};

	setCurrentSelectedId(that, currentSelectedId) {
		var highlight = that.hiveBoardState[currentSelectedId].highlight;
		that.hiveBoardState.forEach(function(state) {
			state.highlight = false;
		});
		that.currentSelectedId = currentSelectedId;
		that.hiveBoardState[currentSelectedId].highlight = highlight;
	};

	toggleHighlight(that, id, currentSelectedId, hiveBoardState) {
		if (currentSelectedId >= 0 && currentSelectedId !== id) {
		    var state = hiveBoardState.find(function(state) {
			    return state.id === currentSelectedId;
		    });
			state.highlight = false;
		}
		hiveBoardState.forEach(function(state) {
			if (state.id === id) {
				state.highlight = !state.highlight;
				if (state.highlight) {
					currentSelectedId = state.id;
					that.chatComponent.sendServerMessage('select');
				}
			}
		});
		that.setCurrentSelectedId(that, currentSelectedId);
	};

	showPossibleMove(me, that, ctx, col, row) {
		var pointXY = {x: that.center_xy[col][row].x, y: that.center_xy[col][row].y};
		that.drawHexagon("", ctx, pointXY, that.size, null, true, true);
	};

	showEmptyLocation(me, that, ctx, col, row) {
		var pointXY = {x: that.center_xy[col][row].x, y: that.center_xy[col][row].y};
		that.drawHexagon("", ctx, pointXY, that.size, null, false, true);
	};

	moveBug(new_xy) {
		var moved = false;
		if (this.currentSelectedId >= 0 && this.hiveBoardState[this.currentSelectedId].highlight) {
			var src_id = this.currentSelectedId;
			var dst_id = (new_xy.y * 11) + new_xy.x;

			this.hiveBoardState[dst_id].type  = this.hiveBoardState[src_id].type;
			this.hiveBoardState[dst_id].color = this.hiveBoardState[src_id].color;
			this.hiveBoardState[dst_id].highlight = false;

			this.hiveBoardState[src_id].type  = '';
			this.hiveBoardState[src_id].color = '';
			this.hiveBoardState[src_id].highlight = false;

			this.currentSelectedId = -1;
			moved = true;			
		}
		return moved;
	};

	placeBug(me, that, ctx, id, theColor, theType, col, row, stackDepth) {
		var message;
		var pointXY = {x: that.center_xy[col][row].x, y: that.center_xy[col][row].y};

		me.beginRegion();

		if (stackDepth > 0) {
			var nextXY;
			that.drawHexagon("", ctx, pointXY, that.size, '#f2f2f2', false, false);
			for (var layer = 0; layer < stackDepth; layer++) {
				nextXY = {x: pointXY.x - (5 * layer), y: pointXY.y - (10 * layer)}; 
				that.drawHexagon("", ctx, nextXY, that.size, '#f2f2f2', false, false);
			}
			pointXY = {x: nextXY.x - 5, y: nextXY.y - 10};
		}

		me.addRegionEventListener("mousemove", function(){
			message = "Mouse MOVE " + theColor + " " + theType + "!";
			that.writeMessage(ctx, message);
			console.log(message + "\n");     
		});
		me.addRegionEventListener("mouseover", function(){
			message = "Mouse OVER " + theColor + " " + theType + "!";
			that.writeMessage(ctx, message);
			console.log(message + "\n");     
		});
		me.addRegionEventListener("mousedown", function(){
			message = "Mouse DOWN " + theColor + " " + theType + "!";
			that.writeMessage(ctx, message);
			console.log(message + "\n");     
		});
		me.addRegionEventListener("mouseup", function(){
			message = "Mouse UP " + theColor + " " + theType + "!";
			if (that.hiveBoardState[id].color === '' && that.hiveBoardState[id].type === '') {
				var new_xy = {x: that.hiveBoardState[id].x, y: that.hiveBoardState[id].y};
				if (that.moveBug(new_xy)) {
					that.chatComponent.sendServerMessage('move');
				}
			} else {
				that.toggleHighlight(that, id, that.currentSelectedId, that.hiveBoardState);
			}
			that.writeMessage(ctx, message);
			console.log(message + "\n");     
		});
		me.addRegionEventListener("mouseout", function(){
			message = "Mouse OUT " + theColor + " " + theType + "!";
			that.writeMessage(ctx, message);
			console.log(message + "\n");     
		});
		me.addRegionEventListener("touchstart", function(){
			message = "Touch START " + theColor + " " + theType + "!";
			that.writeMessage(ctx, message);
			console.log(message + "\n");     
		});
		me.addRegionEventListener("touchend", function(){
			message = "Touch END " + theColor + " " + theType + "!";
			that.toggleHighlight(that, id, that.currentSelectedId, that.hiveBoardState);
			that.writeMessage(ctx, message);
			console.log(message + "\n");     
		});

		if (theType !== '' && theColor !== '') {
			that.drawHiveBugPiece(ctx, id, theType, theColor, pointXY);
		} else {
			that.showEmptyLocation(null, that, ctx, col, row);
		}
		that.rebuild_chrome_hack = !that.rebuild_chrome_hack;
		ctx.globalAlpha = that.rebuild_chrome_hack ? 1 : 0.999;
        me.closeRegion();
	};

	loadGame(ctx) {
		console.log("HOORAY!!!! The page is loaded ... time draw the Hive board ...\n");
		
		// get events and our game canvas context so we can draw our board
		var events = new Events("hiveCanvas");
		var message = "";

		var that = this;
		events.setStage(function() {
			this.clear();

			// show the current hive board
			if (that.hiveBoardState.length > 0) {
				var me = this;
				that.hiveBoardState.forEach(function(state) {
					that.placeBug(me, that, ctx, state.id, state.color, state.type, state.x, state.y, state.z);
				});
			}
		});
	};

	redoHiveGameBoard() {
		var that = this;
		if (this.serverGameMsg && this.serverGameMsg.contents.board.cells) {
			this.serverGameMsg.contents.board.cells.forEach(function(cell) {
				var id = ( (cell.row - 1) * 11) + cell.col;
				that.hiveBoardState[id].color = cell.tiles[0].color;
				that.hiveBoardState[id].type  = cell.tiles[0].bug;
				if (cell.tiles.length > 1) {
					that.hiveBoardState[id].z = cell.tiles.length -1;
				}
			});
		}
	};

	public handleServerEvent(serverData:any) {
		this.serverGameMsg = JSON.parse(serverData.text) as IServerGameMsg;
		this.redoHiveGameBoard();
	};

	public handleEvent(childData:any) {
		this.sampleChildData = childData;
		var xy = this.sampleChildData.split(',');
		if (xy && xy.length > 1) {
			this.placement_xy = {x: Number(xy[0]), y: Number(xy[1])};
			if (this.moveBug(this.placement_xy)) {
				this.chatComponent.sendServerMessage('move');
			}
		}
	};

	constructor() {
		console.log("vert  = " + this.vert + "\n");
		console.log("horiz = " + this.horiz + "\n");

		console.log("canvas_rows = " + this.canvas_rows + "\n");
		console.log("canvas_cols = " + this.canvas_cols + "\n");

		this.center_xy = new Array(this.canvas_rows);
		for (var i = 0; i < this.canvas_rows; i++) {
			this.center_xy[i] = new Array(this.canvas_cols);
		}

		for (var row = 0; row < this.canvas_rows; row++) {
		    for (var col = 0; col < this.canvas_cols; col++) {
//				var row_offset = (col % 2 === 0 ? 0 : this.horiz/2);
//				var x_coord = this.start_x + (row * this.horiz) + row_offset;
//				var y_coord = this.start_y + (col * this.vert);

				var row_offset = (col % 2 === 0 ? 0 : this.vert/2);
				var x_coord = this.start_x + (col * this.horiz);
				var y_coord = this.start_y + (row * this.vert) + row_offset;

				this.center_xy[row][col] = {x: x_coord, y: y_coord};
				console.log("...center_xy[" + row + "][" + col + "] == " + JSON.stringify(this.center_xy[row][col]) + "\n");
			}
		}

		// for each image name create the image and put it into the images array
		var that = this;
		this.hiveBugs.forEach(function(bug){
			var image = new Image();		// create image
			image.src = bug.src;			// set the src
			image.style.width = '50%';		// shrink the bug down
			image.style.height = 'auto';	// let the height follow
			that.images.push(image);		// push it onto the image array
		});

		var id = 22;
		for (var row = 2; row < 11; row++) {
			for (var col = 0; col < 11; col++) {
				var state = {id: id, type: '', color: '', x: col, y: row, z: 0, highlight: false};
				this.hiveBoardState.push(state);
				id++;
			}
		}
	};

    ngAfterViewInit() { // wait for the view to init before using the element
    	let ctx: CanvasRenderingContext2D = this.hiveCanvas.nativeElement.getContext("2d");

		// we are ready to now load the game
		this.loadGame(ctx);
    }
}
