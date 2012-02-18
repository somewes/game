Ext.define('Game.game.Game', {
	extend: 'Ext.util.Observable',
	requires: [
		'Game.animation.Manager'
	],
	
	config: {
		canvas: null,
		context: null,
		targetFps: 60,
		actualFps: 0,
		width: 640,
		height: 480,
		deviceInput: null,
		camera: null,
		player: null,
		animationManager: null
	},
	
	frameCount: 0,
	ignoreUserInput: false,
	
	constructor: function(config) {
		this.initConfig(config);
		this.callParent(arguments);
		this.getCanvas().on('afterrender', this.init, this);
	},
	
	init: function() {
		this.initCanvas();
		this.initCamera();
		this.initDeviceInput();
		this.initAnimationManager();
		this.initMap();
		this.initPlayer();
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
	
	initAnimationManager: function() {
		this.animationManager = new Game.animation.Manager();
	},
	
	initMap: function() {
//		this.map = Ext.create('Game.map.Tile', {
//			tileSheet: '/modules/wes/img/sprites/maps/jidoor/sheet_new.png',
//			game: this
//		});
		this.map = Ext.create('Game.map.Debug', {
			width: 1000,
			height: 1000,
			game: this
		});
		this.map.checkIfReady();
	},
	
	initPlayer: function() {
		this.player = Ext.create('Game.sprite.Character', {
			name: 'Mog',
			x: 0,
			y: 0,
			width: 32,
			height: 48,
			src: '/modules/wes/img/sprites/players/mog.png'
		});
		this.player2 = Ext.create('Game.sprite.Character', {
			name: 'Gogo',
			x: 0,
			y: 0,
			width: 32,
			height: 48,
			src: '/modules/wes/img/sprites/players/gogo.png'
		});
		
		this.player.acceptInput(this.getDeviceInput());
		this.map.addSprite(this.player);
		this.camera.follow(this.player);
		this.map.addSprite(this.player2);
		this.player2.animate({
			duration: 2000,
			to: {
				x: 100,
				y: 100
			}
		});
		
		var sword = Ext.create('Game.gear.Sword');
		this.player.equip(sword, 'rightHand');
//		this.player.attack(this.player2);
//		this.player.attack(this.player2);
//		this.player.attack(this.player2);
	},
	
	initSprites: function() {
		var num = 0;
		for (var i = 0; i < num; i++) {
			this.map.addSprite(Ext.create('Game.sprite.Base', {
				randomize: true
			}));
		}
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
//		this.getUserInput();
//		this.handleUserInput();
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
		var currentTime = (new Date()).getTime();
		this.animationManager.updatePositions(currentTime);
		this.map.handleCollisions();
		this.camera.updatePosition(currentTime);
	},
	
	draw: function() {
		this.map.draw();
	}
	
});

// map needs a base class that is empty so we can test configs like mode for sidescrolling or overhead view
// sprites need to be a mixed collection in the map class so we can loop through an array and also look up the sprites by object to remove them
