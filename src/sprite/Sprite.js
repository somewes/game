Ext.define('Game.sprite.Sprite', {
	extend: 'Ext.util.Observable',
	requires: [
//		'Redokes.sprite.Animation'
	],
	
	config: {
		game: null,
		context: null,
		hidden: false,
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		acceptInput: false,
		deviceInput: null,
		animation: null,
		isAnimating: false,
		color: '#FF0000',
		randomize: false
	},
	
	constructor: function(config) {
		this.initConfig(config);
		this.callParent(arguments);
		this.init();
	},

	init: function() {
		if (this.randomize) {
			this.randomizeProperties();
		}
	},
	
	randomizeProperties: function() {
		this.x = this.randy(0, 1000);
		this.y = this.randy(0, 800);
		this.width = this.randy(10, 60);
		this.height = this.randy(10, 60);
	},
	
	randy: function(min, max) {
		return Math.random() * (max - min) + min;
	},
	
	getRandomHex: function() {
		var letters = '0123456789ABCDEF'.split('');
		var color = '#';
		for (var i = 0; i < 6; i++ ) {
			color += letters[Math.round(Math.random() * 15)];
		}
		return color;
	},
	
	doRandomAnimation: function() {
		this.color = this.getRandomHex();
		this.animate(this.randy(0, 1000), this.randy(0, 800), this.randy(500, 5000), this.doRandomAnimation, this);
	},
	
	initGame: function(game) {
		this.setGame(game);
		this.setContext(game.getContext());
		if (this.getAcceptInput()) {
			this.setDeviceInput(game.getDeviceInput());
			this.initDeviceListeners();
		}
		this.fireEvent('init', this);
		if (this.randomize) {
			this.doRandomAnimation();
		}
	},
	
	animate: function(x, y, duration, callback, scope) {
		if (this.animation && this.animation.isRunning) {
			this.animation.stop();
		}
		this.animation = Ext.create('Game.Animation', {
			sprite: this,
			stopX: x,
			stopY: y,
			duration: duration,
			callback: callback,
			scope: scope
		});
	},
	
	initDeviceListeners: function() {
		this.getDeviceInput().on('keydownspace', this.onKeyDownSpace, this);
		this.getDeviceInput().on('keyupspace', this.onKeyUpSpace, this);
		this.getDeviceInput().on('keydownup', this.onKeyDownUp, this);
		this.getDeviceInput().on('keyupup', this.onKeyUpUp, this);
		this.getDeviceInput().on('keydownright', this.onKeyDownRight, this);
		this.getDeviceInput().on('keyupright', this.onKeyUpRight, this);
		this.getDeviceInput().on('keydowndown', this.onKeyDownDown, this);
		this.getDeviceInput().on('keyupdown', this.onKeyUpDown, this);
		this.getDeviceInput().on('keydownleft', this.onKeyDownLeft, this);
		this.getDeviceInput().on('keyupleft', this.onKeyUpLeft, this);
	},
	
	hide: function() {
		this.hidden = true;
	},
	
	show: function() {
		this.hidden = false;
	},
	
	updatePosition: function(currentTime) {
		if (this.isAnimating) {
			this.animation.updatePosition(currentTime);
		}
	},
	
	draw: function() {
		if (!this.hidden) {
			var context = this.getContext();
			context.fillStyle = this.color;
			context.fillRect(this.x, this.y, this.width, this.height);
		}
	},
	
	onKeyDownSpace: function() {
		this.game.addSprite(Ext.create('Game.sprite.Sprite', {
			randomize: true
		}));
	},
	
	onKeyUpSpace: function() {
		
	}
	
});