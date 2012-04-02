Ext.define('Game.gear.Weapon', {
	extend: 'Game.gear.Gear',
	
	config: {
		name: 'Weapon',
		type: 'weapon',
		weaponClass: null,
		minDamage: 0,
		maxDamage: 0,
		weaponSpeed: 0
	},
	
	randy: function(min, max) {
		return Math.random() * (max - min) + min;
	},
	
	getDamage: function() {
		return this.randy(this.minDamage, this.maxDamage);
	}
	
});