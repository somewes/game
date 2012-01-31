Ext.define('Game.game.Game', {
	extend: 'Ext.util.Observable',
	
	config: {
		canvas: null,
		context: null,
		targetFps: 60,
		actualFps: 0,
		width: 800,
		height: 600,
		deviceInput: null,
		camera: null
	},
	
	frameCount: 0,
	sprites: null,
	animations: null,
	ignoreUserInput: false,
	
	constructor: function(config) {
		this.initConfig(config);
		this.callParent(arguments);
		this.sprites = [];
		this.animations = [];
		this.getCanvas().on('afterrender', this.init, this);
	},
	
	init: function() {
		this.initCanvas();
		this.initCamera();
//		this.context.scale(1.4, 1.4);
		this.initDeviceInput();
		this.initSprites();
		this.initGameLoop();
	},
	
	initCanvas: function() {
		this.getCanvas().setWidth(this.getWidth());
		this.getCanvas().setHeight(this.getHeight());
		this.setContext(this.getCanvas().getEl().dom.getContext('2d'));
	},
	
	initCamera: function() {
		this.setCamera(Ext.create('Game.Camera', {
			width: this.getWidth(),
			height: this.getHeight()
		}));
		this.getCamera().initGame(this);
		window.camera = this.getCamera();
	},
	
	initDeviceInput: function() {
		this.setDeviceInput(Ext.create('Game.input.Keyboard', {
			game: this
		}));
	},
	
	initSprites: function() {
		var num = 99;
		for (var i = 0; i < num; i++) {
			this.addSprite(Ext.create('Game.sprite.Sprite', {
				randomize: true
			}));
		}
		var player = Ext.create('Game.sprite.Sprite', {
			x: 0,
			y: 0,
			width: 10,
			height: 10,
			acceptInput: true
		});
		this.addSprite(player);
	},
	
	addSprite: function(sprite) {
		// Set any listeners
		sprite.initGame(this);
		this.sprites.push(sprite);
		console.log('Sprite count: ' + this.sprites.length);
	},
	
	initGameLoop: function() {
		setInterval(Ext.bind(this.updateGame, this), 1000 / this.getTargetFps());
		setInterval(Ext.bind(this.updateFps, this), 1000);
	},
	
	updateFps: function() {
		this.setActualFps(this.frameCount);
		this.frameCount = 0;
	},
	
	updateGame: function() {
		this.camera.clear();
		this.getUserInput();
		this.handleUserInput();
		this.updatePositions();
		this.draw();
		this.camera.restore();
		this.frameCount++;
	},
	
	getUserInput: function() {
		
	},
	handleUserInput: function() {
		
	},
	updatePositions: function() {
		var currentTime = new Date();
		var numSprites = this.sprites.length;
		for (var i = 0; i < numSprites; i++) {
			this.sprites[i].updatePosition(currentTime);
		}
		
		// sort by width
		this.sprites.sort(this.sortByY);
		
		this.camera.updatePosition(currentTime);
	},
	sortByY: function(a, b) {
		return a.y - b.y;
	},
	
	draw: function() {
		// draw random bg boxes
		for (var i = 0; i < 9; i++) {
			for (var j = 0; j < 9; j++) {
				this.context.fillStyle = '#' + i + j + j + i + j + j;
				this.context.fillRect(100*i, 100*j, 100, 100);
			}
		}
		
		var numSprites = this.sprites.length;
		for (var i = 0; i < numSprites; i++) {
			this.sprites[i].draw();
		}
	}
	
})