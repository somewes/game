Ext.define('Game.map.Debug', {
	extend: 'Game.map.Map',
	
	config: {
		
	},
	
	draw: function() {
		if (!this.isReady) {
			return;
		}
		var context = this.context;
		
		// draw random bg boxes
		for (var i = 0; i < 10; i++) {
			for (var j = 0; j < 10; j++) {
				context.fillStyle = '#' + i + j + j + i + j + j;
				context.fillRect(100*i, 100*j, 101, 101);
			}
		}
		
		var items = this.sprites.items;
		items.sort(this.sortByY);
		var numSprites = items.length;
		for (var i = 0; i < numSprites; i++) {
			items[i].draw();
		}
	}
	
});