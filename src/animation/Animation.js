Ext.define('Game.animation.Animation', {
	extend: 'Ext.util.Observable',
	
	config: {
		duration: 1000,
		target: null,
		to: {},
		from: {},
		scope: this,
		easing: Ext.fx.Easing.linear,
		onStop: false,
		
		startX: 0,
		startY: 0,
		stopX: 0,
		stopY: 0,
		totalX: 0,
		totalY: 0,
		
		bezier: false,
		
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
		isRunning: false,
		id: false
	},
	
	constructor: function(config) {
		this.initConfig(config);
		if (!this.id) {
			this.setId('animation-' + Game.sprite.Base.spriteId++);
		}
		this.callParent(arguments);
	},
	
	calculateValues: function() {
		this.startX = this.from.x != null ? this.from.x : this.target.getX();
		this.startY = this.from.y != null ? this.from.y : this.target.getY();
		this.startWidth = this.target.getWidth();
		this.startHeight = this.target.getHeight();
		
		this.stopX = this.to.x != null ? this.to.x : this.startX;
		this.stopY = this.to.y != null ? this.to.y : this.startY;
		this.stopWidth = this.to.width || this.startWidth;
		this.stopHeight = this.to.height || this.startHeight;
		
		this.totalX = this.stopX - this.startX;
		this.totalY = this.stopY - this.startY;
		this.totalWidth = this.stopWidth - this.startWidth;
		this.totalHeight = this.stopHeight - this.startHeight;
	},
	
	start: function() {
		this.calculateValues();
		this.fireEvent('start', this);
		
		this.isRunning = true;
		this.startTime = (new Date()).getTime();
		this.stopTime = (new Date(this.startTime + this.duration)).getTime();
	},
	
	cancel: function() {
		this.isRunning = false;
	},
	
	stop: function() {
		this.isRunning = false;
		
		if (this.onStop) {
			this.onStop.apply(this.scope, [this.target]);
		}
		this.fireEvent('stop', this);
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
		this.remainingTime = this.stopTime - currentTime;
		
		var percentage = this.elapsedTime / this.duration;
		
		if (percentage > .75 && this.on75) {
			this.on75.apply(this.scope);
			delete this.on75;
			
		}
		
		var easeValue = this.easing(percentage);
		
		// Check if path is a line or bezier
		if (this.bezier) {
			this.target.x = this.startX * this.b0(easeValue) + this.bezier.x * this.b1(easeValue) + this.stopX * this.b2(easeValue);
			this.target.y = this.startY * this.b0(easeValue) + this.bezier.y * this.b1(easeValue) + this.stopY * this.b2(easeValue);
		}
		else {
			this.target.x = this.startX + this.totalX * easeValue;
			this.target.y = this.startY + this.totalY * easeValue;
		}
		
		this.target.width = this.startWidth + this.totalWidth * easeValue;
		this.target.height = this.startHeight + this.totalHeight * easeValue;
	},
	
	b0: function(percent) {
		return Math.pow(1 - percent, 2);
	},
	
	b1: function(percent) {
		return 2 * percent * (1 - percent);
	},
	
	b2: function(percent) {
		return percent * percent;
	}
	
});