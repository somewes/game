Ext.define('Game.canvas.Drawable', {
	
	config: {
		context: null,
		hidden: false,
		x: 0,
		y: 0
	},
	
	constructor: function(config) {
		this.initConfig(config);
	},
	
	draw: function() {
		
	},
	
	toggleHidden: function() {
		this.setHidden(!this.getHidden());
	}
	
});