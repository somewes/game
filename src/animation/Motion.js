Ext.define('Game.animation.Motion', {
	extend: 'Ext.util.Observable',
	
	config: {
		target: null,
		isMoving: false,
		id: false,
		
		dx: 0,
		xVelocity: 0,
		initialXVelocity: 0,
		xVelocityMax: null,
		xVelocityStop: null,
		dy: 0,
		yVelocity: 0,
		initialYVelocity: 0,
		yVelocityMax: null,
		yVelocityStop: null,
		yStop: null,
		xStop: null,
		xAcceleration: 0,
		yAcceleration: 0,
		motionStartTime: null,
		motionStartX: 0,
		motionStartY: 0,
		motionElapsedTime: 0
	},
	
	constructor: function(config) {
		this.initConfig(config);
		if (!this.id) {
			this.setId('motion-' + Game.sprite.Base.spriteId++);
		}
		
		this.callParent(arguments);
	},
	
	startMotion: function(config) {
		Ext.apply(this, config);
		this.initialXVelocity = this.xVelocity;
		this.initialYVelocity = this.yVelocity;
		this.motionStartX = this.target.x;
		this.motionStartY = this.target.y;
		this.motionElapsedTime = 0;
		this.motionStartTime = (new Date()).getTime();
		this.isMoving = true;
		this.fireEvent('start', this);
	},
	
	stopMotion: function() {
		this.xVelocity = 0;
		this.yVelocity = 0;
		this.xVelocityStop = null;
		this.yVelocityStop = null;
		this.motionElapsedTime = 0;
		this.isMoving = false;
		this.fireEvent('stop', this);
	},
	
	updatePosition: function(currentTime) {
		this.motionElapsedTime = currentTime - this.motionStartTime;
		var t = (this.motionElapsedTime) / 1000;
		
		// Update velocity based on time
		this.xVelocity = this.initialXVelocity + this.xAcceleration * t;
		this.yVelocity = this.initialYVelocity + this.yAcceleration * t;
		this.dx = this.xVelocity > 0 ? this.xVelocity : -this.xVelocity;
		this.dy = this.yVelocity > 0 ? this.yVelocity : -this.yVelocity;
		
		// Restrict velocity and detect when we need to stop in a direction
		if (this.xVelocityMax !== null && this.dx > this.xVelocityMax) {
			this.dx = this.xVelocityMax;
			this.xVelocity = this.xVelocity > 0 ? this.xVelocityMax : -this.xVelocityMax;
		}
		else if (this.xVelocityStop !== null && ((this.xAcceleration < 0 && this.xVelocity <= this.xVelocityStop) || (this.xAcceleration > 0 && this.xVelocity >= this.xVelocityStop))) {
			this.xVelocity = this.xVelocityStop;
			this.xAcceleration = 0;
			this.initialXVelocity = 0;
		}
		
		if (this.yVelocityMax !== null && this.dy > this.yVelocityMax) {
			this.dy = this.yVelocityMax;
			this.yVelocity = this.yVelocity > 0 ? this.yVelocityMax : -this.yVelocityMax;
		}
		else if (this.yVelocityStop !== null && ((this.yAcceleration < 0 && this.yVelocity <= this.yVelocityStop) || (this.yAcceleration > 0 && this.yVelocity >= this.yVelocityStop))) {
			this.yVelocity = this.yVelocityStop;
			this.yAcceleration = 0;
			this.initialYVelocity = 0;
		}
		
		if ((this.xVelocity === this.xVelocityStop || this.xVelocity === 0) && (this.yVelocity === this.yVelocityStop || this.yVelocity === 0)) {
			this.stopMotion();
		}
		
		// Update position
		this.target.x += this.xVelocity;
		this.target.y += this.yVelocity;
		
		if (this.yStop !== null && this.y >= this.yStop) {
			this.yVelocity = 0;
			this.yAcceleration = 0;
			this.initialYVelocity = 0;
			this.yStop = null;
		}
	}
	
});