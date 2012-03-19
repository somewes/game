Ext.define('Game.battle.Battle', {
	extend: 'Ext.util.Observable',
	requires: [
		'Game.battle.ui.Battle'
	],
	
	config: {
		game: null,
		ui: null,
		sprites: null,
		parties: null,
		actionQueue: null,
		queueRunning: false
	},
	
	constructor: function(config) {
		this.initConfig(config);
		this.actionQueue = [];
		this.callParent(arguments);
		this.init();
		this.start();
	},
	
	init: function() {
		this.initMap();
		this.initParties();
		this.initUi()
	},
	
	updateBattle: function() {
		var d = (new Date()).getTime();
		var numSprites = this.sprites.length;
		for (var i = 0; i < numSprites; i++) {
			if (this.sprites[i].life > 0) {
				this.sprites[i].updateAtb(d);
			}
		}
	},
	
	initMap: function() {
		
	},
	
	initParties: function() {
		this.parties = [];
		this.sprites = [];
		var i = 0;
		this.sprites.push(this.game.player);
		for (var i = 0; i < this.game.characters.length; i++) {
//		for (var i = 0; i < 1; i++) {
			if (this.game.characters[i].id != this.game.player.id) {
				this.sprites.push(this.game.characters[i]);
				this.game.map.removeSprite(this.game.characters[i]);
				this.game.map.addSprite(this.game.characters[i]);
			}
		}
		
		var numSprites = this.sprites.length;
		for (var i = 0; i < numSprites; i++) {
			this.sprites[i].un('atbfull', this.onAtbFull);
			this.sprites[i].un('die', this.onDie);
			this.sprites[i].on('atbfull', this.onAtbFull, this);
			this.sprites[i].on('die', this.onDie, this);
		}
	},
	
	onAtbFull: function(character) {
//			console.log(character.name + ' is full');
		if (character.life <= 0) {
			return;
		}
		if (Math.random() > .5) {
			character.createAndPlaySequence([4]);
		}
		else {
			character.playSequence(new Game.sprite.Sequence({
				sequence: [8, 9],
				duration: 300
			}));
		}
		this.addAction(Ext.bind(function() {
			var enemy = this.getRandomEnemy(character);
			if (enemy) {
				var damage = character.attack(enemy);
//				console.log(character.name + ' is attacking ' + enemy.name + ' for ' + damage);
			}
		}, this), character);
	},
	
	onDie: function(character, attacker) {
		console.log(attacker.name + ' killed ' + character.name);
		character.createAndPlaySequence([13]);
	},
	
	getRandomEnemy: function(character) {
		var randomInt = Math.round(character.randy(0, this.sprites.length - 1));
		var enemy = this.sprites[randomInt];
		if (enemy.id != character.id && enemy.life > 0) {
			return enemy;
		}
		else {
			for (var i = 0; i < this.sprites.length; i++) {
				var newIndex = (randomInt + i) % this.sprites.length;
				enemy = this.sprites[newIndex];
				if (enemy.id != character.id && enemy.life > 0) {
					return enemy;
				}
			}
		}
		return false;
	},
	
	addAction: function(action, character) {
		this.actionQueue.push({
			action: action,
			character: character
		});
		if (this.queueRunning === false) {
			this.runNextAction();
		}
	},
	
	runNextAction: function() {
		this.checkWinCondition();
		if (this.queueRunning === false && this.actionQueue.length) {
			this.queueRunning = true;
			if (this.actionQueue[0].character.life > 0) {
				this.actionQueue[0].character.on('actionfinish', function(character) {
					// Check if there is a winner
					if (this.queueRunning === false) {
//						console.log('already a winner');
						return;
					}
//					console.log('not a winner play first frame');
					character.createAndPlaySequence([0]);
					this.actionQueue.splice(0, 1);
					this.queueRunning = false;
					var d = (new Date()).getTime();
					character.resetAtb(d);
					this.runNextAction();
				}, this, {
					single: true
				});
				this.actionQueue[0].character.createAndPlaySequence([10]);
				this.actionQueue[0].action();
			}
			else {
				this.actionQueue.splice(0, 1);
				this.queueRunning = false;
				this.runNextAction();
			}
		}
	},
	
	checkWinCondition: function() {
		var numSprites = this.sprites.length;
		var numSpritesAlive = 0;
		var winner = false;
		for (var i = 0; i < numSprites; i++) {
			if (this.sprites[i].life > 0) {
				winner = this.sprites[i];
				numSpritesAlive++;
			}
		}
		if (numSpritesAlive == 1) {
			console.log(winner.name + ' wins');
			this.finish();
			winner.playSequence(new Game.sprite.Sequence({
				sequence: [6, 7],
				duration: 1000
			}));
			setTimeout(Ext.bind(this.reset, this), 5000);
			return winner;
		}
		return false;
	},
	
	initUi: function() {
		this.ui = new Game.battle.ui.Battle({
			game: this.game
		});
	},
	
	start: function() {
		this.ui.hidden = false;
		var d = (new Date()).getTime();
		var numSprites = this.sprites.length;
		for (var i = 0; i < numSprites; i++) {
			this.sprites[i].resetAtb(d);
		}
		this.updateInterval = setInterval(Ext.bind(this.updateBattle, this), 1000 / this.game.getTargetFps());
	},
	
	finish: function() {
		clearInterval(this.updateInterval);
		this.actionQueue = [];
		this.queueRunning = false;
	},
	
	reset: function() {
		var numSprites = this.sprites.length;
		for (var i = 0; i < numSprites; i++) {
			this.sprites[i].life = this.sprites[i].maxLife;
			this.sprites[i].createAndPlaySequence([0]);
		}
		this.start();
	}
	
});