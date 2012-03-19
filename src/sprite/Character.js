Ext.define('Game.sprite.Character', {
	extend: 'Game.sprite.Sprite',
	requires: [
		'Game.Equipment',
		'Game.Inventory',
		'Game.sprite.DamageText',
		'Game.sprite.Base'
	],
	
	config: {
		name: '',
		level: 1,
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
		atbStartDate: null
	},
	
	constructor: function(config) {
		this.initConfig(config);
		this.callParent(arguments);
		this.equipment = new Game.Equipment({
			character: this
		});
		this.inventory = new Game.Inventory({
			character: this
		});
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
	
	attack: function(target) {
//		console.log(this.name + ' attacked ' + target.name);
		var damage = this.equipment.getWeapon().getDamage();
		damage = target.defend(damage)
		
		var originalX = this.x;
		var originalY = this.y;
		
		var distance = this.getDistance({x: this.x, y: this.y}, {x: target.x, y: target.y});
		var duration = Math.log(distance) * 100;
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
			target.receiveDamage(damage, this);
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
		return damage;
	},
	
	showDamageText: function(damage, target) {
		var damageText = new Game.sprite.DamageText({
			damage: damage,
			following: target,
			x: target.x,
			y: target.y
		});
		this.game.map.addSprite(damageText);

		var xVelocity = this.randy(-5, 5);
		var yVelocity = -damage;
		damageText.startMotion({
			xVelocity: xVelocity,
			xAcceleration: -xVelocity*3,
			xVelocityStop: 0,
			yVelocity: yVelocity,
			yAcceleration: -yVelocity*3,
			yStop: target.y
//				xStop: target.x + xVelocity*5
		}).on('stop', function(motion) {
			motion.target.remove();
		}, this);
	},
	
	defend: function(damage) {
//		console.log('Damage started at ' + damage);
		damage -= damage * this.strength / 100;
		damage = Math.round(damage);
//		console.log(this.name + ' was hit for ' + damage);
		return damage;
	},
	
	receiveDamage: function(damage, attacker) {
		this.showDamageText(damage, this);
		this.life -= damage;
		this.life = Math.round(this.life);
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
			var difference = d - this.atbStartDate;
			this.atb = difference / (100 - this.speed * 5);
			if (this.atb >= 100) {
				this.atbFull = true;
				this.atb = 100;
				this.fireEvent('atbfull', this);
			}
		}
		
			
		
	},
	
	resetAtb: function(d) {
		this.atb = 0;
		this.atbFull = false;
		this.atbStartDate = d;
	},
	
	draw: function() {
		this.callParent(arguments);
		this.context.fillStyle = '#ffffff';
		this.context.font = '10pt Calibri';
		this.context.fillText(this.life + '/' + this.maxLife + ' ' + Math.round(this.atb), this.x, this.y + this.height + 10);
	}
	
});