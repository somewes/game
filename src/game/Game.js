Ext.define('Game.game.Game', {
	extend: 'Ext.util.Observable',
	
	config: {
		canvas: null,
		context: null,
		targetFps: 60,
		actualFps: 0,
		width: 600,
		height: 400,
		deviceInput: null
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
		this.getCanvas().setWidth(this.getWidth());
		this.getCanvas().setHeight(this.getHeight());
		this.setContext(this.getCanvas().getEl().dom.getContext('2d'));
		this.initDeviceInput();
		this.initSprites();
		this.initGameLoop();
	},
	
	initDeviceInput: function() {
		this.setDeviceInput(Ext.create('Game.input.Keyboard', {
			game: this
		}));
	},
	
	makeRandomSprite: function() {
		return Ext.create('Game.sprite.Sprite', {
			
		});
	},
	
	initSprites: function() {
		var num = 24;
		for (var i = 0; i < num; i++) {
			this.addSprite(Ext.create('Game.sprite.Sprite'));
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
		this.context.clearRect(0, 0, this.width, this.height);
		this.getUserInput();
		this.handleUserInput();
		this.updatePositions();
		this.draw();
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
	},
	sortByY: function(a, b) {
		return a.y - b.y;
	},
	
	draw: function() {
		var numSprites = this.sprites.length;
		for (var i = 0; i < numSprites; i++) {
			this.sprites[i].draw();
		}
	}
	
})