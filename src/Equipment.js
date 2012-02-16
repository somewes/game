Ext.define('Game.Equipment', {
	extend: 'Ext.util.Observable',
	
	config: {
		character: null,
		leftHand: null,
		rightHand: null,
		head: null,
		body: null,
		hands: null,
		feed: null,
		belt: null,
		accessory1: null,
		accessory2: null,
		accessory3: null,
		accessory4: null
	},
	
	constructor: function(config) {
		this.initConfig(config);
		this.callParent(arguments);
		
	},
	
	equip: function(item, slot) {
//		console.log('equip ' + item.name + ' in ' + slot);
		this.unequip(this[slot]);
		this[slot] = item;
//		console.log(this);
	},
	
	unequip: function(item) {
		if (item !== null) {
			this.character.inventory.putItem(item);
		}
	},
	
	getWeapon: function() {
		return this.rightHand;
	}
	
});