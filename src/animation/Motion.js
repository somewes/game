Ext.define('Game.animation.Motion', {
	extend: 'Ext.util.Observable',
	
	config: {
		isMoving: false,
		dx: 0,
		xVelocity: 0,
		initialXVelocity: 0,
		xVelocityMax: null,
		vxStop: null,
		dy: 0,
		yVelocity: 0,
		initialYVelocity: 0,
		yVelocityMax: null,
		vyStop: null,
		yStop: null,
		xStop: null,
		xAcceleration: 0,
		yAcceleration: 0,
		motionStartTime: null,
		motionStartX: 0,
		motionStartY: 0,
		motionElapsedTime: 0
	},
	
	startMotion: function(config) {
		Ext.apply(this, config);
		this.initialXVelocity = this.vx;
		this.initialYVelocity = this.yVelocity;
		this.motionStartX = this.x;
		this.motionStartY = this.y;
		this.motionElapsedTime = 0;
		this.motionStartTime = (new Date()).getTime();
		this.isMoving = true;
	},
	
	stopMotion: function() {
		console.log('stop motion');
		this.vx = 0;
		this.yVelocity = 0;
		this.vxStop = null;
		this.yVelocityStop = null;
		this.motionElapsedTime = 0;
		this.isMoving = false;
	},
	
	updateMotionPosition: function(currentTime) {
		this.motionElapsedTime = currentTime - this.motionStartTime;
		var t = (this.motionElapsedTime) / 1000;
		
		// Update velocity based on time
		this.vx = this.initialXVelocity + this.xAcceleration * t;
		this.yVelocity = this.initialYVelocity + this.yAcceleration * t;
		this.dx = this.vx > 0 ? this.vx : -this.vx;
		this.dy = this.yVelocity > 0 ? this.yVelocity : -this.yVelocity;
		
		// Restrict velocity and detect when we need to stop in a direction
		if (this.xVelocityelocityMax !== null && this.dx > this.xVelocityelocityMax) {
			this.dx = this.xVelocityelocityMax;
			this.vx = this.vx > 0 ? this.xVelocityelocityMax : -this.xVelocityelocityMax;
		}
		else if (this.vxStop !== null && ((this.xAcceleration < 0 && this.vx <= this.vxStop) || (this.xAcceleration > 0 && this.vx >= this.vxStop))) {
			this.vx = this.vxStop;
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
		
		if ((this.vx === this.vxStop || this.vx === 0) && (this.yVelocity === this.yVelocityStop || this.yVelocity === 0)) {
			this.stopMotion();
		}
		
		// Update position
		this.x += this.vx;
		this.y += this.yVelocity;
		
		if (this.yStop !== null && this.y >= this.yStop) {
			this.yVelocity = 0;
			this.yAcceleration = 0;
			this.initialYVelocity = 0;
			this.yStop = null;
		}
	}
	
});