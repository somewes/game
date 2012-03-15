Ext.define('Game.canvas.Canvas', {
	extend: 'Ext.util.Observable',
	requires: [
		'Game.canvas.Component'
	],
	
	config: {
		game: null,
		id: false,
		hidden: true,
		context: null
	},
	
	constructor: function(config) {
		this.initConfig(config);
		this.context = this.game.context;
		
		if (!this.id) {
			this.setId('canvas-' + Game.sprite.Base.spriteId++);
		}
		
		this.callParent(arguments);
		
		this.getGame().getCanvasManager().add(this);
	},
	
	draw: function() {
		
	}
	
});