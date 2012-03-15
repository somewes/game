Ext.define('Game.canvas.Manager', {
	extend: 'Ext.util.Observable',
	requires: [
		'Game.canvas.Canvas'
	],
	
	config: {
		items: null,
		numItems: 0
	},
	
	constructor: function(config) {
		this.initConfig(config);
		this.callParent(arguments);
		this.items = new Ext.util.MixedCollection();
	},
	
	add: function(item) {
		item.on('destroy', this.remove, this);
		this.items.add(item.id, item);
		this.numItems = this.items.items.length;
	},
	
	remove: function(item) {
		console.log('map destroyed so remove it');
		this.items.remove(item);
		this.numItems = this.items.items.length;
		console.log(this.numItems);
	}
	
});