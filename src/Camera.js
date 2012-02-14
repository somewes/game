Ext.define('Game.Camera', {
	extend: 'Game.sprite.Base',
	
	config: {
		boundX: null,
		boundY: null,
		boundX2: null,
		boundY2: null
	},
	
	setBounds: function(config) {
		Ext.apply(this, config);
		if (this.boundX !== null) {
			this.setBoundX(this.boundX);
		}
		
		if (this.boundY !== null) {
			this.setBoundY(this.boundY);
		}
		
		if (this.boundX2 !== null) {
			this.setBoundX2(this.boundX2 - this.width);
		}
		
		if (this.boundY2 !== null) {
			this.setBoundY2(this.boundY2 - this.height);
		}
		console.log(this);
	},
	
	clear: function() {
		this.context.clearRect(0, 0, this.width, this.height);
		this.context.save();
	},
	
	updatePosition: function() {
		this.callParent(arguments);
		
		if (this.boundX !== null && this.x < this.boundX) {
			this.x = this.boundX;
		}
		else if (this.boundX2 !== null && this.x > this.boundX2) {
			this.x = this.boundX2;
		}
		if (this.boundY !== null && this.y < this.boundY) {
			this.y = this.boundY;
		}
		else if (this.boundY2 !== null && this.y > this.boundY2) {
			this.y = this.boundY2;
		}
		
		this.context.translate(-this.x, -this.y);
	},
	
	restore: function() {
		this.context.restore();
	}
	
});