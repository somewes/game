Ext.define('Game.ui.Debug', {
	extend: 'Game.ui.Base',
	
	config: {
		
	},
	
	drawUi: function() {
		var player = this.game.player;
		
		var x = 10;
		var y = 28;
		var lineHeight = 26;
		
		this.context.fillStyle = '#ffffff';
		this.context.font = '18pt Calibri';
		
		// Draw fps
		this.context.fillText(this.game.getActualFps() + ' fps', x, y);
		y+= lineHeight;
		
		// Draw coordinates
		this.context.fillText('x: ' + player.x, x, y);
		y+= lineHeight;
		this.context.fillText('y: ' + player.y, x, y);
		y+= lineHeight;
		
		// Draw player life/mana
		this.context.fillText('Life: ' + player.life + '/' + player.maxLife, x, y);
		y+= lineHeight;
		this.context.fillText('Mana: ' + player.mana + '/' + player.maxMana, x, y);
		y+= lineHeight;
		this.context.fillText('ATB: ' + player.atb, x, y);
		y+= lineHeight;
	}
	
});