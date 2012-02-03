Ext.define('Game.Camera', {
	extend: 'Game.sprite.Base',
	
	config: {
		boundX: 0,
		boundY: 0
	},
	
	setBounds: function(x, y) {
		this.setBoundX(x - this.width);
		this.setBoundY(y - this.height);
		console.log(this.boundX);
		console.log(this.boundY);
	},
	
	clear: function() {
		this.context.clearRect(0, 0, this.width, this.height);
		this.context.save();
	},
	
	updatePosition: function() {
		this.callParent(arguments);
		
		if (this.x < 0) {
			this.x = 0;
		}
		else if (this.x > this.boundX) {
			this.x = this.boundX;
		}
		if (this.y < 0) {
			this.y = 0;
		}
		else if (this.y > this.boundY) {
			this.y = this.boundY;
		}
		
		this.context.translate(-this.x, -this.y);
	},
	
	restore: function() {
		this.context.restore();
	}
	
});