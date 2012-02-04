Ext.define('Game.animation.Motion', {
	extend: 'Ext.util.Observable',
	
	config: {
		isMoving: false,
		vx: 0,
		v0x: 0,
		vxMax: null,
		vxStop: null,
		vy: 0,
		v0y: 0,
		vyMax: null,
		vyStop: null,
		ax: 0,
		ay: 0,
		startTime: null,
		startX: 0,
		startY: 0
	},
	
	accelerateX: function(acceleration, max) {
		this.ax = acceleration;
		this.vxStop = null;
		this.vxMax = max;
		this.startMotion();
	},
	
	decelerateX: function(acceleration, vxStop) {
		this.ax = acceleration;
		this.vxStop = vxStop;
		this.startMotion();
	},
	
	accelerateY: function(acceleration, max) {
		this.ay = acceleration;
		this.vyStop = null;
		this.vyMax = max;
		this.startMotion();
	},
	
	decelerateY: function(acceleration, vyStop) {
		this.ay = acceleration;
		this.vyStop = vyStop;
		this.startMotion();
	},
	
	
	startMotion: function(config) {
		Ext.apply(this, config);
		this.v0x = this.vx;
		this.v0y = this.vy;
		this.startX = this.x;
		this.startY = this.y;
		this.startTime = (new Date()).getTime();
		this.isMoving = true;
	},
	
	stopMotion: function() {
		console.log('stop motion');
		this.vx = 0;
		this.vy = 0;
		this.vxStop = null;
		this.vyStop = null;
		this.isMoving = false;
	},
	
	updateMotionPosition: function(currentTime) {
		var t = (currentTime - this.startTime) / 1000;
		
		// Update velocity based on time
		this.vx = this.v0x + this.ax * t;
		this.vy = this.v0y + this.ay * t;
		var dx = this.vx > 0 ? this.vx : -this.vx;
		var dy = this.vy > 0 ? this.vy : -this.vy;
		
		// Restrict velocity and detect when we need to stop in a direction
		if (this.vxMax !== null && dx > this.vxMax) {
			this.vx = this.vx > 0 ? this.vxMax : -this.vxMax;
		}
		else if (this.vxStop !== null && ((this.ax < 0 && this.vx <= this.vxStop) || (this.ax > 0 && this.vx >= this.vxStop))) {
			this.vx = 0;
			this.ax = 0;
			this.v0x = 0;
		}
		
		if (this.vyMax !== null && dy > this.vyMax) {
			this.vy = this.vy > 0 ? this.vyMax : -this.vyMax;
		}
		else if (this.vyStop !== null && ((this.ay < 0 && this.vy <= this.vyStop) || (this.ay > 0 && this.vy >= this.vyStop))) {
			this.vy = 0;
			this.ay = 0;
			this.v0y = 0;
		}
		
		if (this.vx === 0 && this.vy === 0) {
			this.stopMotion();
		}
		
		// Update position
		this.x += this.vx;
		this.y += this.vy;
	}
	
});