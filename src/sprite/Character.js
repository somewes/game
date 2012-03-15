Ext.define('Game.sprite.Character', {
	extend: 'Game.sprite.Sprite',
	
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
		inventory: null
	},
	
	constructor: function(config) {
		this.initConfig(config);
		this.callParent(arguments);
		this.equipment = Ext.create('Game.Equipment', {
			character: this
		});
		this.inventory = Ext.create('Game.Inventory', {
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
			this.showDamageText(damage, target);
		}, this);
		
		this.animate({
			duration: duration/1.5,
			to: {
				x: originalX,
				y: originalY
			}
		});
	},
	
	showDamageText: function(damage, target) {
		var damageText = Ext.create('Game.sprite.DamageText', {
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
		
		this.callSharedMethod('attack', [this.game.map.player2]);
	},
	
	shootPixels: function() {
		var numPixels = 50;
		for (var i = 0; i < numPixels; i++) {
			var hex = this.getRandomHex();
			var xVelocity = this.randy(-5, 5);
			var yVelocity = this.randy(-5, 5);
			var one = Ext.create('Game.sprite.Base', {
				width: 5,
				height: 5,
				color: hex,
				x: this.x + this.halfWidth,
				y: this.y + this.halfHeight
			});
			
			var two = Ext.create('Game.sprite.Base', {
				width: 4,
				height: 4,
				color: hex,
				x: one.x,
				y: one.y
			});
			
			var three = Ext.create('Game.sprite.Base', {
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
	}
	
});