Ext.define('Game.map.Map', {
	extend: 'Ext.util.Observable',
	
	config: {
		game: null,
		tileSheet: null,
		img: null,
		isTileSheetLoaded: false,
		isReady: false,
		tileData: [],
		numLayers: 0,
		numRows: 0,
		numColumns: 0,
		tileSize: 32,
		spawnX: 0,
		spawnY: 0,
		spawnZ: 0
	},
	
	constructor: function(config) {
		this.initConfig(config);
		this.callParent(arguments);
		this.context = this.game.context;
		
		this.on('processtiledata', this.checkIfReady, this);
		this.on('tilesheetload', this.checkIfReady, this);
		
		this.getTileData();
		this.initTileSheet();
//		console.log(this);
	},
	
	initTileSheet: function() {
		this.img = Ext.get(new Image());
		this.img.on('load', function() {
			this.isTileSheetLoaded = true;
			this.fireEvent('tilesheetload');
		}, this);
		this.loadTileSheet(this.tileSheet);
	},
	
	loadTileSheet: function(src) {
		if (src) {
			this.tileSheet = src;
			this.img.dom.src = src;
		}
	},
	
	checkIfReady: function() {
		if (this.isTileSheetLoaded && this.isProcessed) {
			this.generateBackground();
//			console.log('we are ready');
//			this.isReady = true;
		}
		else {
//			console.log('not ready yet');
		}
	},
	
	draw: function() {
		if (!this.isReady) {
			return;
		}
		
		var context = this.context;
		var tileSize = this.tileSize;
		var camera = this.game.camera;
		context.putImageData(this.bgData, -camera.x, -camera.y, camera.x, camera.y, camera.width, camera.height);
		
		// Find out where to start the x,y loop
//		var startX = Math.floor(this.game.camera.x / tileSize);
//		var stopX = startX + (this.game.camera.width / tileSize)  + 1;
//		var startY = Math.floor(this.game.camera.y / this.tileSize);
//		var stopY = startY + this.game.camera.height / tileSize + 1;
//		
//		if (stopY > this.numRows) {
//			stopY = this.numRows;
//		}
//		if (stopX > this.numColumns) {
//			stopX = this.numColumns;
//		}
//		
//		for (var layerIndex = 0; layerIndex < this.numLayers; layerIndex++) {
//			for (var rowIndex = startY; rowIndex < stopY; rowIndex++) {
//				for (var columnIndex = startX; columnIndex < stopX; columnIndex++) {
//					var tileIndex = this.tileData[layerIndex][rowIndex][columnIndex];
//					context.drawImage(this.img.dom, tileIndex * tileSize, 0, tileSize, tileSize, columnIndex * tileSize, rowIndex * tileSize, tileSize, tileSize);
//				}
//			}
//		}
		
		// draw random bg boxes
//		for (var i = 0; i < 10; i++) {
//			for (var j = 0; j < 10; j++) {
//				context.fillStyle = '#' + i + j + j + i + j + j;
//				context.fillRect(100*i, 100*j, 101, 101);
//			}
//		}
	},
	
	getTileData: function() {
//		console.log('get it');
		this.tileData = [
			[
				[
					1,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
				],
				[
					0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
				],
				[
					0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
				],
				[
					0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
				],
				[
					0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
				],
				[
					0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
				],
				[
					0,0,23,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
				],
				[
					0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
				],
				[
					0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
				],
				[
					0,0,0,23,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
				],
				[
					0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
				],
				[
					0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
				]
			]
		];
		this.processTileData();
	},
	
	processTileData: function() {
//		console.log('process');
		this.numLayers = this.tileData.length;
		this.numRows = this.tileData[0].length;
		this.numColumns = this.tileData[0][0].length;
		this.setGameDetails();
		this.isProcessed = true;
		this.fireEvent('processtiledata');
	},
	
	setGameDetails: function() {
		this.game.camera.setBounds({
			boundX: 0,
			boundY: 0,
			boundX2: this.numColumns * this.tileSize,
			boundY2: 700
		});
		this.game.camera.follow(this.game.player);
		this.game.addSprite(this.game.player);
	},
	
	generateBackground: function() {
		var context = this.context;
		var tileSize = this.tileSize;
		
		this.bgCanvas = Ext.get(document.createElement('canvas'));
		document.body.appendChild(this.bgCanvas.dom);
		this.bgCanvas.dom.width = this.numColumns * tileSize;
		this.bgCanvas.dom.height = this.numRows * tileSize;
		this.bgContext = this.bgCanvas.dom.getContext('2d');
		this.bgData = null;
		
		for (var layerIndex = 0; layerIndex < this.numLayers; layerIndex++) {
			for (var rowIndex = 0; rowIndex < this.numRows; rowIndex++) {
				for (var columnIndex = 0; columnIndex < this.numColumns; columnIndex++) {
					var tileIndex = this.tileData[layerIndex][rowIndex][columnIndex];
					this.bgContext.drawImage(this.img.dom, tileIndex * tileSize, 0, tileSize, tileSize, columnIndex * tileSize, rowIndex * tileSize, tileSize, tileSize);
				}
			}
		}
		
		this.bgData = this.bgContext.getImageData(0, 0, this.bgCanvas.dom.width, this.bgCanvas.dom.height);
		this.isReady = true;
	}
	
});