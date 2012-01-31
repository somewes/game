Ext.define('Game.Camera', {
	extend: 'Game.sprite.Sprite',
	
	clear: function() {
		this.context.clearRect(0, 0, this.width, this.height);
		this.context.save();
		this.context.translate(this.x, this.y);
	},
	
	restore: function() {
		this.context.restore();
	}
	
});