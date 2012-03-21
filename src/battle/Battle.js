Ext.define('Game.battle.Battle', {
	extend: 'Ext.util.Observable',
	requires: [
		'Game.battle.ui.Battle',
		'Game.character.Party'
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
		this.callParent(arguments);
		this.init();
	},
	
	init: function() {
		this.sprites = new Ext.util.MixedCollection();
		this.parties = [];
		this.actionQueue = [];
		this.initMap();
		this.initParties();
		this.initUi()
	},
	
	updateBattle: function() {
		var d = (new Date()).getTime();
		var numSprites = this.sprites.items.length;
		for (var i = 0; i < numSprites; i++) {
			if (this.sprites.items[i].life > 0) {
				this.sprites.items[i].updateAtb(d);
			}
		}
	},
	
	initMap: function() {
		
	},
	
	createParty: function() {
		var party = new Game.character.Party();
		party.on({
			scope: this,
			characteradd: this.onCharacterAdd,
			characterremove: this.onCharacterRemove
		})
		this.parties.push(party);
		return party;
	},
	
	onCharacterAdd: function(party, character) {
		this.sprites.add(character.getId(), character);
	},
	
	onCharacterRemove: function(party, character) {
		this.sprites.remove(character);
	},
	
	initParties: function() {
		var totalParties = 2;
		var totalCharacters = 6;
		
		// Create parties
		for (var i = 0; i < totalParties; i++) {
			this.createParty();
		}
		
		// Put characters in parties
		for (var i = 0; i < totalCharacters; i++) {
			var partyIndex = Math.floor(Math.random() * totalParties);
			this.parties[partyIndex].addCharacter(this.game.characters[i]);
		}
		
		// Balance teams
		var minPerParty = Math.floor(totalCharacters / totalParties);
		var maxPerParty = Math.ceil(totalCharacters / totalParties);
		for (var i = 0; i < totalParties; i++) {
			while (this.parties[i].characters.items.length > maxPerParty) {
				// Party has too many, start distributing to any party with less
				for (var j = 0; j < totalParties; j++) {
					if (this.parties[j].characters.items.length < minPerParty) {
						var character = this.parties[i].characters.items[this.parties[i].characters.items.length-1];
						this.parties[i].removeCharacter(character);
						this.parties[j].addCharacter(character);
					}
				}
			}
		}
		
//		this.parties[0].addCharacter(this.game.player);
		
		// Add sprites to map
		var numSprites = this.sprites.items.length;
		for (var i = 0; i < numSprites; i++) {
			this.game.map.removeSprite(this.sprites.items[i]);
			this.game.map.addSprite(this.sprites.items[i]);
		}
		
		// Position parties
		var numParties = this.parties.length;
		for (var i = 0; i < numParties; i++) {
			var baseX = 50;
			var baseY = 200;
			if (i) {
				baseX = 500;
			}
			
			var party = this.parties[i];
			var numCharacters = party.characters.items.length;
			for (var j = 0; j < numCharacters; j++) {
				var x = baseX + j * 5;
				var y = baseY + j * 60;
				party.characters.items[j].animate({
					duration: 400,
					from: {
						x: 0,
						y: 0
					},
					to: {
						x: x,
						y: y
					},
					bezier: {
						x: party.characters.items[j].x + (x - party.characters.items[j].x) * .9,
						y: y - 150
					}
				});
			}
		}
		
		this.registerSpriteListeners();
	},
	
	registerSpriteListeners: function() {
		var numSprites = this.sprites.items.length;
		for (var i = 0; i < numSprites; i++) {
			this.sprites.items[i].on('atbfull', this.onAtbFull, this);
			this.sprites.items[i].on('die', this.onDie, this);
			this.sprites.items[i].on('levelup', this.onLevelUp, this);
			this.sprites.items[i].on('receivedamage', this.onReceiveDamage, this);
		}
	},
	
	unregisterSpriteListeners: function() {
		var numSprites = this.sprites.items.length;
		for (var i = 0; i < numSprites; i++) {
			this.sprites.items[i].un('atbfull', this.onAtbFull);
			this.sprites.items[i].un('die', this.onDie);
			this.sprites.items[i].un('actionfinish', this.onActionFinish);
			this.sprites.items[i].un('levelup', this.onLevelUp);
			this.sprites.items[i].un('receivedamage', this.onReceiveDamage);
		}
	},
	
	onAtbFull: function(character) {
//		console.log(character.name + ' is full');
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
		attacker.on('actionfinish', function() {
			attacker.gainExp(character.giveExp());
		}, this, {
			single: true
		});
	},
	
	onLevelUp: function(character) {
		character.playSequence(new Game.sprite.Sequence({
			sequence: [10]
		}));
		setTimeout(Ext.bind(function(character) {
			if (character.isAlive()) {
				character.playSequence(new Game.sprite.Sequence({
					sequence: [0]
				}));
			}
		}, this, [
			character
		]), 1000);
	},
	
	onReceiveDamage: function(character, damage) {
		this.showDamageText(damage, character);
		character.playAndRestore(new Game.sprite.Sequence({
			sequence: [11]
		}), 500);
	},
	
	showDamageText: function(damage, target) {
		
		var maxDamage = 10000;
		var damagePercent = damage / maxDamage;
		
		var minTextSize = 16;
		var maxTextSize = 32;
		var textSize = Math.round(minTextSize + (maxTextSize - minTextSize) * damagePercent);
		var minYVelocity = 3;
		var maxYVelocity = 8;
		var yVelocity = -Math.round(minYVelocity + (maxYVelocity - minYVelocity) * damagePercent);
		
		var damageText = new Game.sprite.DamageText({
			damage: damage,
			following: target,
			x: target.x,
			y: target.y,
			textSize: textSize
		});
		this.game.map.addSprite(damageText);

		var xVelocity = target.randy(-5, 5);
		damageText.startMotion({
			xVelocity: xVelocity,
			xAcceleration: -xVelocity*1.5,
			xVelocityStop: 0,
			yVelocity: yVelocity,
			yAcceleration: -yVelocity*3,
			yStop: target.y
//				xStop: target.x + xVelocity*5
		}).on('stop', function(motion) {
			motion.target.remove();
		}, this);
	},
	
	getRandomEnemy: function(character) {
		// Get another party
		var numParties = this.parties.length;
		var enemyParty = false;
		for (var i = 0; i < numParties; i++) {
			if (character.party != this.parties[i]) {
				enemyParty = this.parties[i];
				break;
			}
		}
		
		// Get random enemy from party
		var randomInt = Math.round(character.randy(0, enemyParty.characters.items.length - 1));
		var enemy = enemyParty.characters.items[randomInt];
		if (enemy.id != character.id && enemy.life > 0) {
			return enemy;
		}
		else {
			for (var i = 0; i < enemyParty.characters.items.length; i++) {
				var newIndex = (randomInt + i) % enemyParty.characters.items.length;
				enemy = enemyParty.characters.items[newIndex];
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
				this.pauseAtb();
				this.actionQueue[0].character.on('actionfinish', this.onActionFinish, this, {
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
	
	onActionFinish: function(character) {
		// Check if there is a winner
		this.resumeAtb();
		if (this.queueRunning === false) {
			return;
		}
		character.createAndPlaySequence([0]);
		this.actionQueue.splice(0, 1);
		this.queueRunning = false;
		var d = (new Date()).getTime();
		character.resetAtb(d);
		this.runNextAction();
	},
	
	checkWinCondition: function() {
		var numParties = this.parties.length;
		var numPartiesAlive = 0;
		var winner = false;
		for (var i = 0; i < numParties; i++) {
			var numCharacters = this.parties[i].characters.items.length;
			for (var j = 0; j < numCharacters; j++) {
				if (this.parties[i].characters.items[j].life > 0) {
					numPartiesAlive++;
					winner = this.parties[i];
					break;
				}
			}
		}
		
		if (numPartiesAlive == 1) {
			this.stop();
			var numCharacters = winner.characters.items.length;
			for (var i = 0; i < numCharacters; i++) {
				if (winner.characters.items[i].life > 0) {
					winner.characters.items[i].playSequence(new Game.sprite.Sequence({
						sequence: [6, 7],
						duration: 1000
					}));
				}
			}
			setTimeout(Ext.bind(this.finish, this), 2000);
			return true;
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
		var numSprites = this.sprites.items.length;
		for (var i = 0; i < numSprites; i++) {
			this.sprites.items[i].startAtbAction(1000, 4000);
			this.sprites.items[i].resetAtb(d);
		}
		this.updateInterval = setInterval(Ext.bind(this.updateBattle, this), 1000 / this.game.getTargetFps());
	},
	
	stop: function() {
		this.unregisterSpriteListeners();
		clearInterval(this.updateInterval);
		this.actionQueue = [];
		this.queueRunning = false;
	},
	
	pauseAtb: function() {
		clearInterval(this.updateInterval);
		this.updateInterval = false;
	},
	
	resumeAtb: function() {
		if (this.updateInterval) {
			return;
		}
		var d = (new Date()).getTime();
		var numSprites = this.sprites.items.length;
		for (var i = 0; i < numSprites; i++) {
			this.sprites.items[i].resumeAtb(d);
		}
		this.updateInterval = setInterval(Ext.bind(this.updateBattle, this), 1000 / this.game.getTargetFps());
	},
	
	finish: function() {
		this.fireEvent('finish', this);
	},
	
	reset: function() {
		var numSprites = this.sprites.items.length;
		for (var i = 0; i < numSprites; i++) {
			this.sprites.items[i].life = this.sprites.items[i].maxLife;
			this.sprites.items[i].createAndPlaySequence([0]);
		}
	}
	
});