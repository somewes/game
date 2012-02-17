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
	
	attack: function(target) {
//		console.log(this.name + ' attacked ' + target.name);
		var damage = this.equipment.getWeapon().getDamage();
		damage = target.defend(damage)
		
		target.x += 100;
		target.y += 100;
		
		var originalX = this.x;
		var originalY = this.y;
		this.animate({
			duration: 250,
			to: {
				x: target.x + this.halfWidth,
				y: target.y + this.halfHeight
			}
		})
	},
	
	defend: function(damage) {
//		console.log('Damage started at ' + damage);
		damage -= damage * this.strength / 100;
//		console.log(this.name + ' was hit for ' + damage);
		return damage;
	},
	
	onKeyDownSpace: function() {
		this.jump();
//		this.shootPixels();
//		this.attack(this.game.player2);
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
		var gravity = 30;
		var yVelocity = -25;
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
			this.startMotion({
				xAcceleration: 5,
				xVelocityMax: 3,
				xVelocityStop: null
			});
			this.playSequence(Ext.create('Game.sprite.Sequence', {
				sequence: [18,3,33,3]
			}));
		}
	},
	
	onKeyUpRight: function() {
		if (this.inputDevice.keysPressed.left) {
			this.onKeyDownLeft();
		}
		else {
			this.startMotion({
				xAcceleration: -3,
				xVelocityStop: 0
			});
		}
	},
	
	onKeyDownLeft: function() {
		if (false && this.motion && this.motion.isFalling) {
			
		}
		else {
			this.startMotion({
				xAcceleration: -5,
				xVelocityMax: 3,
				xVelocityStop: null
			});
			this.playSequence(Ext.create('Game.sprite.Sequence', {
				sequence: [17,2,32,2]
			}));
		}
	},
	
	onKeyUpLeft: function() {
		if (this.inputDevice.keysPressed.right) {
			this.onKeyDownRight()
		}
		else {
			this.startMotion({
				xAcceleration: 3,
				xVelocityStop: 0
			});
		}
	},
	
	onKeyDownUp: function() {
		if (this.motion && this.motion.isFalling) {
			
		}
		else {
			this.startMotion({
				yAcceleration: -5,
				yVelocityMax: 3,
				yVelocityStop: null
			});
			this.playSequence(Ext.create('Game.sprite.Sequence', {
				sequence: [16,1,31,1]
			}));
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
				this.startMotion({
					yAcceleration: 3,
					yVelocityStop: 0
				});
			}
		}
	},
	
	onKeyDownDown: function() {
		if (this.motion && this.motion.isFalling) {
			
		}
		else {
			this.startMotion({
				yAcceleration: 5,
				yVelocityMax: 3,
				yVelocityStop: null
			});
			this.playSequence(Ext.create('Game.sprite.Sequence', {
				sequence: [15,0,30,0]
			}));
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
				this.startMotion({
					yAcceleration: -3,
					yVelocityStop: 0
				});
			}
		}
	}
	
});