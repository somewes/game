Ext.define('Game.map.Debug2', {
	extend: 'Game.map.Map',
	
	config: {
		gravity: 10
	},
	
	drawBg: function() {
		var context = this.context;
		
		// draw random bg boxes
		for (var i = 0; i < 10; i++) {
			for (var j = 0; j < 10; j++) {
				context.fillStyle = '#' + j + i + i + i + j + j;
				context.fillRect(100*i, 100*j, 101, 101);
			}
		}
	}
	
});