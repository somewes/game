Ext.define('Game.map.Map', {
	extend: 'Game.canvas.Canvas',
	requires: [
		'Game.sprite.Character',
		'Game.gear.Sword'
	],
	
	config: {
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
		this.callParent(arguments);
		this.on('mapready', this.onMapReady, this);
		this.sprites = new Ext.util.MixedCollection();
		this.checkIfReady();
	},
	
	checkIfReady: function() {
		if (true && !this.isReady) {
			this.fireEvent('mapready', this);
			this.isReady = true;
		}
	},
	
	addSprite: function(sprite) {
		sprite.initGame(this.game);
		sprite.on('remove', function(sprite) {
			this.sprites.remove(sprite);
		}, this);
		this.sprites.add(sprite.getId(), sprite);
	},
	
	draw: function() {
		if (!this.isReady) {
			return;
		}
		
		this.drawBg();
		this.drawSprites();
	},
	
	drawBg: function() {
		
	},
	
	drawSprites: function() {
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
	
	onMapReady: function() {
		this.initCamera();
		this.initPlayer();
	},
	
	initCamera: function() {
		this.game.camera.setBounds({
			boundX: 0,
			boundY: 0,
			boundX2: this.width,
			boundY2: this.height
		});
		this.game.camera.follow(this.game.player);
	},
	
	initPlayer: function() {
		this.addSprite(this.game.player);
		this.game.player.setX(this.getSpawnX());
		this.game.player.setY(this.getSpawnY());
		this.game.player.inputDevice.enable();
		
		this.player2 = new Game.sprite.Character({
			name: 'Gogo',
			x: 0,
			y: 0,
			width: 32,
			height: 48,
			src: '/modules/wes/img/sprites/players/gogo.png'
		});
		this.addSprite(this.player2);
		this.player2.animate({
			duration: 2000,
			to: {
				x: 100,
				y: 100
			}
		});
		var sword = new Game.gear.Sword({
			minDamage: 10,
			maxDamage: 20
		});
		this.game.player.equip(sword, 'rightHand');
		this.player2.equip(sword, 'rightHand');
	},
	
	initSocketClient: function(client) {
		client.on('createSharedObject', function(client, so) {
			this.game.objects.add(so.id, so);
			this.addSprite(so);
			
		}, this);
		
		client.on('syncSharedObject', function(client, config) {
			console.log('map sync');
			
			var so = this.game.objects.get(config.id);
			Ext.apply(so, config);
		}, this);
		
		client.on('callSharedMethod', function(client, config) {
			console.log('calling shared');
			var so = this.game.objects.get(config.id);
			so[config.methodName].apply(so, config.args);
		}, this);
		
		
	},
	
	handleCollisions: function() {
//		var items = this.sprites.items;
//		var numSprites = items.length;
//		for (var i = 0; i < numSprites; i++) {
//			
//		}
	},
	
	destroy: function() {
		// Remove player from current map
		this.sprites.remove(this.game.player);
		
		// Hide the map
		this.setHidden(true);
		
		this.fireEvent('destroy', this);
		
		// Stop all listeners
		this.clearListeners();
		
	}
	
});