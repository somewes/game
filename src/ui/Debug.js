Ext.define('Game.ui.Debug', {
	extend: 'Game.canvas.Canvas',
	
	config: {
		
	},
	
	constructor: function() {
		this.callParent(arguments);
		this.camera = this.game.camera;
	},
	
	draw: function() {
		this.context.save();
		this.context.translate(this.camera.x, this.camera.y);
		
		var x = 10;
		var y = 28;
		var lineHeight = 30;
		
		this.context.fillStyle = '#ffffff';
		this.context.font = '18pt Calibri';
		
		// Draw fps
		this.context.fillText(this.game.getActualFps() + ' fps', x, y);
		y+= lineHeight;
		
		// Draw coordinates
		this.context.fillText('x: ' + this.game.player.x, x, y);
		y+= lineHeight;
		this.context.fillText('y: ' + this.game.player.y, x, y);
		
		this.context.restore();
	}
	
});