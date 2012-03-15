Ext.define('Game.game.Game', {
	extend: 'Ext.util.Observable',
	requires: [
		'Game.animation.Manager',
		'Game.canvas.Manager',
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
		canvasManager: null,
		animationManager: null,
		objects: null
	},
	
	frameCount: 0,
	
	constructor: function(config) {
		this.initConfig(config);
		this.objects = new Ext.util.MixedCollection();
		this.callParent(arguments);
		this.getCanvas().on('afterrender', this.init, this);
	},
	
	init: function() {
//		this.initSockets();
		this.initCanvas();
		this.initCamera();
		this.initDeviceInput();
		this.initCanvasManager();
		this.initAnimationManager();
		this.initPlayer();
		this.initMap();
		this.initMainUi();
		this.initDebugUi();
		window.game = this;
		this.initSprites();
		this.initGameLoop();
	},
	
	initSockets: function() {
		window.os.getModuleManager().register({
			cls: 'Lapidos.node.client.module.Manager',
			config: {
				serverUrl: 'http://localhost:8080',
				jsFile: 'http://localhost:8080/socket.io/socket.io.js'
			}
		});
		window.os.getServiceManager().onReady('start', function(service) {
			service.onConnect('game', function(client) {
				console.log('Connected to socket');
				this.client = client;
				this.map.initSocketClient(this.client);
			}, this);
		}, this, {
			name: 'socket-manager'
		});
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
	
	initCanvasManager: function() {
		this.setCanvasManager(new Game.canvas.Manager());
	},
	
	initAnimationManager: function() {
		this.setAnimationManager(new Game.animation.Manager());
	},
	
	initMap: function() {
//		this.map = Ext.create('Game.map.Tile', {
//			tileSheet: '/modules/wes/img/sprites/maps/jidoor/sheet_new.png',
//			game: this
//		});
		if (this.map) {
			this.setMap(Ext.create('Game.map.Debug', {
				width: 1000,
				height: 1000,
				game: this,
				hidden: false
			}));
		}
		else {
			this.setMap(Ext.create('Game.map.Debug2', {
				width: 1000,
				height: 1000,
				game: this,
				hidden: false
			}));
		}
		
		this.map.checkIfReady();
	},
	
	setMap: function(map) {
		if (this.map) {
			this.map.destroy();
			delete this.map;
		}
		this.map = map;
		this.map.checkIfReady();
	},
	
	initMainUi: function() {
		this.mainUi = '';
	},
	
	initDebugUi: function() {
		this.debugUi = Ext.create('Game.ui.Debug', {
			game: this,
			hidden: true
		});
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
		this.player.acceptInput(this.getDeviceInput());
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
//		this.map.handleCollisions();
		this.camera.updatePosition(currentTime);
	},
	
	draw: function() {
		var cm = this.getCanvasManager();
		var numItems = cm.getNumItems();
		var items = cm.getItems().items;
		for (var i = 0; i < numItems; i++) {
			if (items[i].hidden === false) {
				items[i].draw();
			}
		}
	}
	
});

// map needs a base class that is empty so we can test configs like mode for sidescrolling or overhead view
