var ExtPath = '/js/ext-4.0.7-gpl/src';
var LapidosPath = '/js/lapidos/src';
var GamePath = '/js/game/src';
var ModulesPath = '/modules';

if (Ext.Loader.config.enabled) {
	Ext.Loader.setPath('Ext', ExtPath);
	Ext.Loader.setPath('Lapidos', LapidosPath);
	Ext.Loader.setPath('Game', GamePath);
	Ext.Loader.setPath('Modules', ModulesPath);
}
else {
	Ext.Loader.setConfig({
		enabled: true,
		paths:{
			Ext: ExtPath,
			Lapidos: LapidosPath,
			Game: GamePath,
			Modules: ModulesPath
		}
	});
}

Ext.onReady(function() {
	Ext.require([
		'Lapidos.os.OS',
		'Lapidos.shell.dom.Dom'
	], function() {
		var os = new Lapidos.os.OS();
		os.getModuleManager().on('launch', function() {
			console.log('launch');
			console.log(arguments);
		}, this);
		var shell = new Lapidos.shell.dom.Dom(os, {
			
		});
		var gameInterface = Ext.create('Game.game.view.Interface', {
			region: 'center',
			title: 'Game'
		});
		
		var viewport = new Ext.Viewport({
			layout: 'border',
			items: [
				gameInterface
			]
		});
	});

	
});