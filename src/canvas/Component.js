Ext.define('Game.canvas.Component', {
	extend: 'Ext.Component',
	autoEl: {
		tag: 'canvas'
	},
	
	config: {
		width: 100,
		height: 100
	},
	
	constructor: function(config) {
		this.initConfig(config);
		this.callParent(arguments);
	},
	
	setWidth: function(width) {
		if (this.getEl()) {
			this.getEl().dom.width = width;
		}
		else {
			this.config.width = width;
		}
	},
	
	setHeight: function(height) {
		if (this.getEl()) {
			this.getEl().dom.height = height;
		}
		else {
			this.config.height = height;
		}
	}
	
})