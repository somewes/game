Ext.define('Game.map.Map', {
	extend: 'Ext.util.Observable',
	
	config: {
		game: null,
		isReady: false,
		
		spawnX: 0,
		spawnY: 0,
		spawnZ: 0,
		
		width: 0,
		height: 0,
		
		type: 'overhead', // overhead or sidescroller
		gravity: 5,
		gravityDirection: 'down',
		
		sprites: null
	},
	
	constructor: function(config) {
		this.initConfig(config);
		this.sprites = new Ext.util.MixedCollection();
		this.callParent(arguments);
		this.context = this.game.context;
	},
	
	checkIfReady: function() {
		this.isReady = true;
		this.setGameDetails();
	},
	
	addSprite: function(sprite) {
		sprite.initGame(this.game);
		this.sprites.add(sprite.getId(), sprite);
	},
	
	draw: function() {
		if (!this.isReady) {
			return;
		}
		
		var items = this.sprites.items;
		items.sort(this.sortByY);
		var numSprites = items.length;
		for (var i = 0; i < numSprites; i++) {
			items[i].draw();
		}
	},
	
	sortByY: function(a, b) {
		return a.y - b.y;
	},
	
	setGameDetails: function() {
		this.game.camera.setBounds({
			boundX: 0,
			boundY: 0,
			boundX2: this.width,
			boundY2: this.height
		});
	}
	
});