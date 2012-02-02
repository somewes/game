Ext.define('Game.Animation', {
	extend: 'Ext.util.Observable',
	
	config: {
		duration: 1000,
		target: null,
		to: {},
		scope: this,
		easing: Ext.fx.Easing.linear,
		onStop: false,
		
		startX: 0,
		startY: 0,
		stopX: 0,
		stopY: 0,
		totalX: 0,
		totalY: 0,
		
		startWidth: 0,
		startHeight: 0,
		stopWidth: 0,
		stopHeight: 0,
		totalWidth: 0,
		totalHeight: 0,
		
		startTime: null,
		stopTime: null,
		elapsedTime: null,
		remainingTime: null,
		isRunning: false
	},
	
	constructor: function(config) {
		this.initConfig(config);
		this.callParent(arguments);
		this.init();
	},
	
	init: function() {
		this.calculateValues();
		this.start();
	},
	
	calculateValues: function() {
		this.startX = this.target.getX();
		this.startY = this.target.getY();
		this.startWidth = this.target.getWidth();
		this.startHeight = this.target.getHeight();
		
		this.stopX = this.to.x || this.startX;
		this.stopY = this.to.y || this.startY;
		this.stopWidth = this.to.width || this.startWidth;
		this.stopHeight = this.to.height || this.startHeight;
		
		this.totalX = this.stopX - this.startX;
		this.totalY = this.stopY - this.startY;
		this.totalWidth = this.stopWidth - this.startWidth;
		this.totalHeight = this.stopHeight - this.startHeight;
	},
	
	start: function() {
		this.isRunning = true;
		this.startTime = new Date();
		this.stopTime = new Date(this.startTime.getTime() + this.duration);
	},
	
	cancel: function() {
		this.isRunning = false;
	},
	
	stop: function() {
		this.isRunning = false;
		if (this.onStop) {
			this.onStop.apply(this.scope, [this.target]);
		}
	},
	
	updatePosition: function(currentTime) {
		if (currentTime > this.stopTime) {
			// last frame
			this.target.x = this.stopX;
			this.target.y = this.stopY;
			this.target.width = this.stopWidth;
			this.target.height = this.stopHeight;
			this.stop();
			return;
		}
		this.elapsedTime = currentTime - this.startTime;
		this.remainingTime = this.stopTime.getTime() - currentTime.getTime();
		
		var percentage = this.elapsedTime / this.duration;
		
		if (percentage > .75 && this.on75) {
			this.on75.apply(this.scope);
			delete this.on75;
			
		}
		
		var easeValue = this.easing(percentage);
		this.target.x = this.startX + this.totalX * easeValue;
		this.target.y = this.startY + this.totalY * easeValue;
		this.target.width = this.startWidth + this.totalWidth * easeValue;
		this.target.height = this.startHeight + this.totalHeight * easeValue;
	}
	
});