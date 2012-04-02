Ext.define('Game.canvas.Canvas', {
	extend: 'Ext.util.Observable',
	requires: [
		'Game.canvas.Component'
	],
	
	config: {
		game: null,
		id: false,
		hidden: true,
		context: null,
		z: 0,
		width: 0,
		height: 0
	},
	
	constructor: function(config) {
		this.initConfig(config);
		this.context = this.game.context;
		this.width = this.game.width;
		this.height = this.game.height;
		
		if (!this.id) {
			this.setId('canvas-' + Game.sprite.Base.spriteId++);
		}
		
		this.callParent(arguments);
		
		this.getGame().getCanvasManager().add(this);
	},
	
	draw: function() {
		
	},
	
	toggleHidden: function() {
		this.setHidden(!this.getHidden());
	}
	
});