Ext.define('Game.gear.Gear', {
	extend: 'Ext.util.Observable',
	
	config: {
		name: 'Gear',
		type: null,
		levelRequirement: 0
	},
	
	constructor: function(config) {
		this.initConfig(config);
		this.callParent(arguments);
		
	}
	
});