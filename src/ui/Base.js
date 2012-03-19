Ext.define('Game.ui.Base', {
	extend: 'Game.canvas.Canvas',
	
	config: {
		x: 0,
		y: 0
	},
	
	constructor: function() {
		this.callParent(arguments);
		this.camera = this.game.camera;
	},
	
	beforeDraw: function() {
		this.context.save();
		this.context.translate(this.camera.x + this.x, this.camera.y + this.y);
	},
	
	draw: function() {
		this.beforeDraw();
		this.drawUi();
		this.afterDraw();
	},
	
	afterDraw: function() {
		this.context.restore();
	}
	
});