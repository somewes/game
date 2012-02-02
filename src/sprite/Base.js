Ext.define('Game.sprite.Base', {
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
		color: '#FF0000',
		randomize: false,
		following: false
	},
	
	constructor: function(config) {
		this.initConfig(config);
		this.callParent(arguments);
		
		if (this.randomize) {
			this.randomizeProperties();
		}
		
		// Set cached properties
		this.halfWidth = this.width / 2;
		this.halfHeight = this.height / 2;
	},
	
	follow: function(sprite) {
		this.following = sprite;
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
		this.animate({
			duration: this.randy(500, 5000),
			onStop: this.doRandomAnimation,
			scope: this,
			to: {
				x: this.randy(0, 1000),
				y: this.randy(0, 800),
				width: this.randy(20, 100),
				height: this.randy(20, 100)
			},
//			easing: Ext.fx.Easing.elasticIn
			easing: Ext.fx.Easing.ease
		});
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
	
	animate: function(config) {
		config.target = this;
		config.scope = this;
		if (this.animation && this.animation.isRunning) {
			console.log('cancel it');
			this.animation.cancel();
			delete this.animation;
		}
		this.animation = Ext.create('Game.Animation', config);
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
		if (this.following) {
			this.x = this.following.x + this.following.halfWidth - this.halfWidth;
			this.y = this.following.y + this.following.halfHeight - this.halfHeight;
		}
		else if (this.animation) {
			this.currentTime = currentTime;
			this.animation.updatePosition(currentTime);
		}
	},
	
	draw: function() {
		if (!this.hidden) {
			var context = this.getContext();
			context.fillStyle = this.color;
			context.fillRect(this.x, this.y, this.width, this.height);
			if (this.animation) {
				context.font = '18pt Calibri';
				context.fillText(this.animation.remainingTime , this.x, this.y);
			}
		}
	},
	
	onKeyDownSpace: function() {
		this.game.addSprite(Ext.create('Game.sprite.Base', {
			randomize: true
		}));
	},
	
	onKeyUpSpace: function() {
		
	}
	
});