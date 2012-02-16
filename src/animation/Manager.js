Ext.define('Game.animation.Manager', {
	extend: 'Ext.util.Observable',
	
	config: {
		animations: null,
		numItems: 0
	},
	
	constructor: function(config) {
		this.initConfig(config);
		this.callParent(arguments);
		this.animations = new Ext.util.MixedCollection();
	},
	
	add: function(animation) {
		this.animations.add(animation.target.id, animation);
		this.numItems = this.animations.items.length;
	},
	
	remove: function(animation) {
		this.animations.remove(animation);
		this.numItems = this.animations.items.length;
	},
	
	updatePositions: function(currentTime) {
		var items = this.animations.items;
		for (var i = 0; i < this.numItems; i++) {
			items[i].updatePosition(currentTime);
		}
		
		// sort by width
//		this.sprites.sort(this.sortByY);
	}
	
});