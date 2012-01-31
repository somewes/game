Ext.define('Game.game.view.Interface', {
	extend: 'Ext.panel.Panel',
	
	initComponent: function() {
		this.items = this.items || [];
		this.init();
		this.callParent(arguments);
	},
	
	init: function() {
		this.initCanvas();
		this.initGame();
	},
	
	initCanvas: function() {
		this.canvas = Ext.create('Game.game.Canvas');
		this.items.push(this.canvas);
	},
	
	initGame: function() {
		this.game = Ext.create('Game.game.Game', {
			canvas: this.canvas
		});
	}
	
});