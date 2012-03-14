Ext.define('Game.module.Game', {
	extend: 'Lapidos.module.Viewable',
	
	requires: [
		'Game.game.view.Interface'
	],
	
	//Config
	config: {
		name: 'game',
		title: 'Game',
		viewConfig: {
			home: {
				cls: 'Game.game.view.Interface'
			}
		},
		menu:[{
			display: 'Game'
		}]
	}
});