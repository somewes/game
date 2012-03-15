Ext.define('Game.game.view.Interface', {
	extend: 'Ext.panel.Panel',
	requires: [
		'Game.canvas.Component',
		'Game.game.Game'
	],
	
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
		this.canvas = new Game.canvas.Component();
		this.items.push(this.canvas);
	},
	
	initGame: function() {
		this.game = new Game.game.Game({
			canvas: this.canvas
		});
	}
	
});