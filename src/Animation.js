Ext.define('Game.Animation', {
	extend: 'Ext.util.Observable',
	
	config: {
		duration: 1000,
		sprite: null,
		startX: 0,
		startY: 0,
		stopX: 0,
		stopY: 0,
		totalX: 0,
		totalY: 0,
		easing: null,
		startTime: null,
		stopTime: null,
		isRunning: false,
		callback: false,
		scope: false
	},
	
	constructor: function(config) {
		this.initConfig(config);
		this.callParent(arguments);
		this.scope = this.scope || this;
		this.init();
	},
	
	init: function() {
		this.start();
	},
	
	start: function() {
		this.isRunning = true;
		this.sprite.isAnimating = true;
		this.startX = this.sprite.getX();
		this.startY = this.sprite.getY();
		this.totalX = this.stopX - this.startX;
		this.totalY = this.stopY - this.startY;
		this.startTime = new Date();
		this.stopTime = new Date(this.startTime.getTime() + this.duration);
	},
	
	stop: function() {
		this.isRunning = false;
		this.sprite.isAnimating = false;
		if (this.callback) {
			this.callback.apply(this.scope, [this.sprite]);
		}
	},
	
	updatePosition: function(currentTime) {
		if (currentTime > this.stopTime) {
			// last frame
			this.sprite.x = this.stopX;
			this.sprite.y = this.stopY;
			this.stop();
			return;
		}
		var elapsedTime = currentTime - this.startTime;
		this.sprite.x = this.startX + (this.totalX) * elapsedTime / this.duration;
		this.sprite.y = this.startY + (this.totalY) * elapsedTime / this.duration;
	}
	
});