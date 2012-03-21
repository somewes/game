Ext.define('Game.game.Game', {
	extend: 'Ext.util.Observable',
	requires: [
		'Game.animation.Manager',
		'Game.canvas.Manager',
		'Game.Camera',
		'Game.input.Keyboard',
		'Game.map.Tile',
		'Game.map.Debug',
		'Game.map.Debug2',
		'Game.ui.Main',
		'Game.ui.Debug',
		'Game.sprite.Character',
		'Game.sprite.Base',
		'Game.battle.Battle'
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
		this.initAllCharacters();
	},
	
	initAllCharacters: function() {
		var names = ['celes', 'cyan', 'edgar', 'gau', 'gogo', 'locke', 'mog', 'relm', 'sabin', 'setzer', 'shadow', 'strago', 'terra', 'umaro'];
		var spritePath = '/modules/wes/img/sprites/players';
		var numNames = names.length;
		this.characters = [];
		for (var i = 0; i < numNames; i++) {
			var minDamage = 10;
			var maxDamage = 20;
			var weapon = new Game.gear.Weapon({
				minDamage: minDamage,
				maxDamage: maxDamage
			});
			this.characters.push(new Game.sprite.Character({
				name: names[i].substr(0, 1).toUpperCase() + names[i].substr(1),
				x: Math.random() * 600,
				y: Math.random() * 400,
				width: 32,
				height: 48,
				life: 50,
				maxLife: 50,
				mana: 25,
				maxMana: 25,
				speed: 5,
				gp: 20,
				src: spritePath + '/' + names[i] + '.png'
			}));
			this.characters[this.characters.length-1].equip(weapon, 'rightHand');
		}
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
	
	makeBattle: function() {
		this.battle = new Game.battle.Battle({
			game: this
		});
		this.battle.start();
		this.battle.on('finish', function(battle) {
			this.battle.reset();
			this.battle.init();
			this.battle.start();
		}, this);
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
		this.setCamera(new Game.Camera({
			width: this.getWidth(),
			height: this.getHeight()
		}));
		
		this.getCamera().initGame(this);
		window.camera = this.getCamera();
	},
	
	initDeviceInput: function() {
		this.setDeviceInput(new Game.input.Keyboard({
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
//		this.map = new Game.map.Tile({
//			tileSheet: '/modules/wes/img/sprites/maps/jidoor/sheet_new.png',
//			game: this
//		});
		if (this.map) {
			this.setMap(new Game.map.Debug({
				width: 1000,
				height: 1000,
				game: this,
				hidden: false
			}));
		}
		else {
			this.setMap(new Game.map.Debug2({
				width: 640,
				height: 480,
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
		this.mainUi = new Game.ui.Main({
			game: this,
			hidden: false
		});
	},
	
	initDebugUi: function() {
		this.debugUi = new Game.ui.Debug({
			game: this,
			hidden: true
		});
	},
	
	initPlayer: function() {
		var randomInt = Math.round(Math.random() * this.characters.length - 1);
		this.player = this.characters[randomInt];
		this.player = this.characters[8];
		this.player.acceptInput(this.getDeviceInput());
		window.player = this.player;
	},
	
	initSprites: function() {
		var num = 0;
		for (var i = 0; i < num; i++) {
			this.map.addSprite(new Game.sprite.Base({
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
