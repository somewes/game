Ext.define('Game.gear.Axe', {
	extend: 'Game.gear.Weapon',
	
	config: {
		name: 'Axe',
		type: 'weapon',
		weaponClass: 'axe'
	},
	
	constructor: function() {
		this.callParent(arguments);
		
	}
	
});