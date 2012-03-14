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
		'Lapidos.os.Os',
		'Lapidos.shell.dom.Dom',
		'Lapidos.shell.navigation.Dom',
		'Game.module.Game'
	], function() {
		window.os = new Lapidos.os.Os();
		
		var shell = new Lapidos.shell.dom.Dom(os, {
			
		});
//		var gameInterface = Ext.create('Game.game.view.Interface', {
//			region: 'center',
//			title: 'Game'
//		});
		var centerPanel = new Ext.panel.Panel({
			layout: 'card',
			region: 'center'
		});
		var navigation = new Lapidos.shell.navigation.Dom({
			region: 'north',
			store: shell.getNavigationStore(),
			height: 20
		});
		
		var viewport = new Ext.Viewport({
			layout: 'border',
			items: [
				navigation,
				centerPanel
			]
		});
		
		os.getModuleManager().on('launch', function(manager, module, launchParams) {
			if(Ext.isFunction(module.isViewable) && module.isViewable()){
				centerPanel.setLoading('Loading ' + module.getName() + '...');
				module.getActiveView(function(view){
					centerPanel.setLoading(false);
					centerPanel.add(view);
					centerPanel.setActive(view);
				}, this);
			}
		}, this);
		
		var modules = [
			'Game.module.Game'
		];
		os.getModuleManager().register(modules);
		var gameModule = os.getModuleManager().getInstance('game');
		gameModule.launch();
	});

	
});