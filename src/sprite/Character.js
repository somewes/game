Ext.define('Game.sprite.Character', {
	extend: 'Game.sprite.Sprite',
	requires: [
		'Game.character.Equipment',
		'Game.character.Inventory',
		'Game.sprite.DamageText',
		'Game.sprite.Base'
	],
	
	config: {
		name: '',
		level: 1,
		exp: 0,
		life: 1,
		maxLife: 1,
		mana: 1,
		maxMana: 1,
		strength: 1,
		vitality: 1,
		dexterity: 1,
		intellect: 1,
		luck: 1,
		speed: 1,
		equipment: null,
		inventory: null,
		
		atb: 0,
		atbFull: false,
		atbStart: 0,
		atbStartDate: null,
		atbElapsed: 0,
		autoBattle: true,
		queuedAction: false,
		
		gp: 0,
		row: 0
	},
	
	constructor: function(config) {
		this.initConfig(config);
		this.callParent(arguments);
		this.equipment = new Game.character.Equipment({
			character: this
		});
		this.inventory = new Game.character.Inventory({
			character: this
		});
	},
	
	getExpToLevel: function(level) {
		if (level) {
			return level * level * level + 5;
		}
		return 0;
	},
	
	levelUp: function() {
		console.log(this.name + ' leveled up!');
		this.level++;
		var moreLife = Math.round(this.randy(this.level + this.vitality * 0.9, this.level + this.vitality * 1.1));
		console.log('Life: ' + this.maxLife + ' -> ' + (this.maxLife + moreLife));
		this.maxLife += moreLife;
		this.life = this.maxLife;
		
		var moreMana = Math.round(this.randy(3, 3 + this.level / 2));
		console.log('Mana: ' + this.maxMana + ' -> ' + (this.maxMana + moreMana));
		this.maxMana += moreMana;
		this.mana = this.maxMana;
		
		this.strength += 1;
		this.vitality += 1;
		this.speed += 1;
		console.log('Strength: ' + (this.strength - 1) + ' -> ' + this.strength);
		console.log('Vitality: ' + (this.vitality - 1) + ' -> ' + this.vitality);
		console.log('Speed: ' + (this.speed - 1) + ' -> ' + this.speed);
		this.fireEvent('levelup', this);
	},
	
	gainExp: function(exp) {
		this.exp += exp;
		console.log(this.name + ' gained ' + exp + ' exp');
		while (this.exp >= this.getExpToLevel(this.level)) {
			this.levelUp();
		}
		console.log(this.getExpToGo() + ' to go');
	},
	
	getExpToGo: function() {
		return this.getExpToLevel(this.level) - this.exp;
	},
	
	giveExp: function() {
		return this.level * 2;
	},
	
	isAlive: function() {
		return this.life > 0;
	},
	
	equip: function(item, slot) {
		this.equipment.equip(item, slot);
//		console.log(this);
	},
	
	getDistance: function(point1, point2) {
		var xs = 0;
		var ys = 0;
		xs = point2.x - point1.x;
		xs = xs * xs;
		ys = point2.y - point1.y;
		ys = ys * ys;
		return Math.sqrt( xs + ys );
	},
	
	getLifePercent: function() {
		return this.life / this.maxLife;
	},
	
	getManaPercent: function() {
		return this.mana / this.maxMana;
	},
	
	defend: function(damage) {
//		console.log('Damage started at ' + damage);
		damage -= damage * this.strength / 100;
		damage = Math.round(damage);
//		console.log(this.name + ' was hit for ' + damage);
		return damage;
	},
	
	receiveDamage: function(damage, attacker) {
		this.life -= damage;
		this.life = Math.round(this.life);
		this.fireEvent('receivedamage', this, damage);
		if (this.life <= 0) {
			this.life = 0;
			this.die(attacker);
		}
	},
	
	die: function(attacker) {
		this.fireEvent('die', this, attacker);
//		this.life = this.maxLife;
	},
	
	onKeyDownSpace: function() {
//		this.jump();
//		this.shootPixels();
//		var sharedData = {
//			name: this.name,
//			src: this.src,
//			width: this.width,
//			height: this.height,
//			x: this.x,
//			y: this.y
//		};
//		this.createShared(this.game.client, sharedData);
		
//		this.callSharedMethod('attack', [this.game.map.player2]);
		this.game.map.player2.attack(this);
	},
	
	onKeyDownF3: function() {
		this.game.debugUi.toggleHidden();
	},
	
	shootPixels: function() {
		var numPixels = 50;
		for (var i = 0; i < numPixels; i++) {
			var hex = this.getRandomHex();
			var xVelocity = this.randy(-5, 5);
			var yVelocity = this.randy(-5, 5);
			var one = new Game.sprite.Base({
				width: 5,
				height: 5,
				color: hex,
				x: this.x + this.halfWidth,
				y: this.y + this.halfHeight
			});
			
			var two = new Game.sprite.Base({
				width: 4,
				height: 4,
				color: hex,
				x: one.x,
				y: one.y
			});
			
			var three = new Game.sprite.Base({
				width: 3,
				height: 3,
				color: hex,
				x: one.x,
				y: one.y
			});
			
			this.game.map.addSprite(one);
			this.game.map.addSprite(two);
			this.game.map.addSprite(three);
			one.startMotion({
				xVelocity: xVelocity,
				yVelocity: yVelocity
			});
			two.startMotion({
				xVelocity: xVelocity*.9,
				yVelocity: yVelocity*.9
			});
			three.startMotion({
				xVelocity: xVelocity*.8,
				yVelocity: yVelocity*.8
			});
			
			
		}
	},
	
	jump: function() {
		var gravity = this.game.map.gravity;
		var yVelocity = -5;
		if (gravity < 0) {
			yVelocity = -yVelocity;
		}
		
		var animationData = {
			yVelocity: yVelocity,
			yVelocityMax: 20,
			yVelocityStop: null,
//			yStop: Math.round(this.randy(this.y - 50, this.y + 200)),
			yStop: this.y
		};
		
		this.startMotion(animationData);
		this.motion.setFalling(true, gravity);
	},
	
	onKeyDownRight: function() {
		if (false && this.motion && this.motion.isFalling) {
			
		}
		else {
			this.callSharedMethod('startMotion', [{
				xAcceleration: 5,
				xVelocityMax: 3,
				xVelocityStop: null,
				xStart: this.x,
				yStart: this.y
			}]);
			
			this.callSharedMethod('createAndPlaySequence', [
				[18,3,33,3]
			]);
		}
	},
	
	onKeyUpRight: function() {
		if (this.inputDevice.keysPressed.left) {
			this.onKeyDownLeft();
		}
		else {
			this.callSharedMethod('startMotion', [{
				xAcceleration: -3,
				xVelocityStop: 0,
				xStart: this.x,
				yStart: this.y
			}]);
		}
	},
	
	onKeyDownLeft: function() {
		if (false && this.motion && this.motion.isFalling) {
			
		}
		else {
			this.callSharedMethod('startMotion', [{
				xAcceleration: -5,
				xVelocityMax: 3,
				xVelocityStop: null,
				xStart: this.x,
				yStart: this.y
			}]);
			
			this.callSharedMethod('createAndPlaySequence', [
				[17,2,32,2]
			]);
		}
	},
	
	onKeyUpLeft: function() {
		if (this.inputDevice.keysPressed.right) {
			this.onKeyDownRight()
		}
		else {
			this.callSharedMethod('startMotion', [{
				xAcceleration: 3,
				xVelocityStop: 0,
				xStart: this.x,
				yStart: this.y
			}]);
		}
	},
	
	onKeyDownUp: function() {
		if (this.motion && this.motion.isFalling) {
			
		}
		else {
			this.callSharedMethod('startMotion', [{
				yAcceleration: -5,
				yVelocityMax: 3,
				yVelocityStop: null,
				xStart: this.x,
				yStart: this.y
			}]);
			
			this.callSharedMethod('createAndPlaySequence', [
				[16,1,31,1]
			]);
		}
	},
	
	onKeyUpUp: function() {
		if (this.motion && this.motion.isFalling) {
			
		}
		else {
			if (this.inputDevice.keysPressed.down) {
				this.onKeyDownDown()
			}
			else {
				this.callSharedMethod('startMotion', [{
					yAcceleration: 3,
					yVelocityStop: 0,
					xStart: this.x,
					yStart: this.y
				}]);
			}
		}
	},
	
	onKeyDownDown: function() {
		if (this.motion && this.motion.isFalling) {
			
		}
		else {
			this.callSharedMethod('startMotion', [{
				yAcceleration: 5,
				yVelocityMax: 3,
				yVelocityStop: null
			}]);
			
			this.callSharedMethod('createAndPlaySequence', [
				[15,0,30,0]
			]);
		}
	},
	
	onKeyUpDown: function() {
		if (this.motion && this.motion.isFalling) {
			
		}
		else {
			if (this.inputDevice.keysPressed.up) {
				this.onKeyDownUp()
			}
			else {
				this.callSharedMethod('startMotion', [{
					yAcceleration: -3,
					yVelocityStop: 0,
					xStart: this.x,
					yStart: this.y
				}]);
			}
		}
	},
	
	updateAtb: function(d) {
		if (this.atbFull) {
			
		}
		else {
			this.atbElapsed += d - this.atbStartDate;
			this.atbStartDate = d;
			var operationTime = 10000;
			var maxSpeed = 100;
			var operationTime = this.atbMaxTime - ((this.atbMaxTime - this.atbMinTime) * this.speed / maxSpeed);
//			operationTime -= (operationTime - 1000) * this.speed / maxSpeed;
			this.atb = this.atbElapsed / operationTime * 100;
			if (this.atb >= 100) {
				this.atbFull = true;
				this.atb = 100;
				this.fireEvent('atbfull', this);
			}
		}
		
	},
	
	startAtbAction: function(minTime, maxTime) {
		this.atbMinTime = minTime;
		this.atbMaxTime = maxTime;
	},
	
	resetAtb: function(d) {
		this.atb = 0;
		this.atbElapsed = 0;
		this.atbFull = false;
		this.atbStartDate = d;
	},
	
	resumeAtb: function(d) {
		this.atbStartDate = d;
	},
	
	getAction: function(action, type) {
		var methodName = 'do' + type + action;
		return Ext.bind(this[methodName], this);
	},
	
	dealDamage: function(target, modifier) {
		if (target.isAlive()) {
			modifier = modifier || 1;
			var damage = this.equipment.getWeapon().getDamage() + this.strength * 2 + this.level;
			damage *= modifier;
			damage = target.defend(damage)
			target.receiveDamage(damage, this);
		}
	},
	
	doDoubleAttack: function(target) {
		var originalX = this.x;
		var originalY = this.y;
		
		this.animate({
			duration: 250,
			to: {
				x: target.x,
				y: target.y
			},
			bezier: {
				x: this.x + (target.x - this.x) * .9,
				y: target.y - 150
			}
		}).on('stop', function() {
			this.dealDamage(target);
		}, this);
		
		this.animate({
			duration: 500,
			to: {
				x: target.x,
				y: target.y
			},
			bezier: {
				x: this.x + (target.x - this.x) * .9,
				y: target.y - 400
			}
		}).on('stop', function() {
			this.dealDamage(target);
		}, this);
		
		this.animate({
			duration: 250,
			to: {
				x: originalX,
				y: originalY
			}
		}).on('stop', function() {
			this.fireEvent('actionfinish', this);
		}, this);
	},
	
	/*
	 * Split damage evenly
	 */
	doSlashAttack: function(targets) {
		var numTargets = targets.length;
		var modifier = 1 / numTargets;
		for (var i = 0; i < numTargets; i++) {
			this.dealDamage(targets[i], modifier);
		}
		setTimeout(Ext.bind(function() {
			this.fireEvent('actionfinish', this);
		}, this), 1000);
	},
	
	doBasicAttack: function(target) {
		var originalX = this.x;
		var originalY = this.y;
		
		var distance = this.getDistance({x: this.x, y: this.y}, {x: target.x, y: target.y});
		if (distance <= 1) {
			distance = 1;
		}
		var duration = Math.log(distance) * 100;
		duration = 300;
		this.animate({
			duration: duration,
			to: {
				x: target.x,
				y: target.y
			},
			bezier: {
				x: this.x + (target.x - this.x) * .9,
				y: target.y - 150
			}
		}).on('stop', function() {
			this.dealDamage(target);
		}, this);
		
		this.animate({
			duration: duration/1.5,
			to: {
				x: originalX,
				y: originalY
			}
		}).on('stop', function() {
			this.fireEvent('actionfinish', this);
		}, this);
	},
	
	draw: function() {
		this.callParent(arguments);
		
		this.context.save();
		this.context.translate(this.x, this.y);
//		this.context.font = '10px Calibri';
		this.context.font = '12px Arial';
		
		// Draw life
		var barWidth = 100;
		this.context.strokeStyle = 'rgb(255, 255, 255)';
		this.context.fillStyle = 'rgb(255, 0, 0)';
		this.context.strokeRect(40, 10, barWidth, 10);
		this.context.fillRect(40, 10, this.life/this.maxLife*barWidth, 10);
		this.context.fillStyle = 'rgb(255, 255, 255)';
		this.context.fillText(this.life + '/' + this.maxLife, 44, 19);
		
		// Draw mana
		this.context.fillStyle = 'rgb(0, 0, 255)';
		this.context.strokeRect(40, 24, barWidth, 10);
		this.context.fillRect(40, 24, this.mana/this.maxMana*barWidth, 10);
		this.context.fillStyle = 'rgb(255, 255, 255)';
		this.context.fillText(this.mana + '/' + this.maxMana, 44, 33);
		
		// Draw experience
		this.context.fillStyle = 'rgb(0, 255, 0)';
		this.context.strokeRect(40, 38, barWidth, 10);
		var expToLevel = this.getExpToLevel(this.level);
		var expLastLevel = this.getExpToLevel(this.level-1);
		var levelPercent = (this.exp - expLastLevel) / (expToLevel - expLastLevel);
		this.context.fillRect(40, 38, levelPercent*barWidth, 10);
		this.context.fillStyle = 'rgb(0, 0, 0)';
		this.context.fillText((this.exp - expLastLevel) + '/' + (expToLevel - expLastLevel), 44, 47);
		
		// Draw atb
		this.context.fillStyle = 'rgb(255, 255, 255)';
		this.context.strokeRect(40, 52, barWidth, 10);
		this.context.fillRect(40, 52, this.atb/100*barWidth, 10);
		
		this.context.fillStyle = 'rgb(255, 255, 255)';
		this.context.fillText('Lvl: ' + this.level, 0, this.height + 10);
		
		this.context.restore();
		
	}
	
});