Ext.define('Game.sprite.Character', {
	extend: 'Game.sprite.Sprite',
	
	config: {
		name: '',
		level: 1,
		life: 0,
		maxLife: 0,
		mana: 0,
		maxMana: 0,
		strength: 0,
		vitality: 0,
		dexterity: 0,
		intellect: 0,
		luck: 0,
		speed: 0,
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
		console.log(this);
	},
	
	attack: function(target) {
		console.log(this.name + ' attacked ' + target.name);
		var damage = this.equipment.getWeapon().getDamage();
		target.defend(damage)
	},
	
	defend: function(damage) {
		console.log(this.name + ' was hit for ' + damage);
	},
	
	onKeyDownSpace: function() {
//		this.jump();
		this.shootPixels();
	},
	
	shootPixels: function() {
		var numPixels = 50;
		for (var i = 0; i < numPixels; i++) {
			var hex = this.getRandomHex();
			var vx = this.randy(-5, 5);
			var vy = this.randy(-5, 5);
			var one = Ext.create('Game.sprite.Base', {
				width: 5,
				height: 5,
				color: hex,
				x: this.x + this.halfWidth,
				y: this.y + this.halfHeight,
			});
			
			var two = Ext.create('Game.sprite.Base', {
				width: 4,
				height: 4,
				color: hex,
				x: one.x,
				y: one.y,
			});
			
			var three = Ext.create('Game.sprite.Base', {
				width: 3,
				height: 3,
				color: hex,
				x: one.x,
				y: one.y,
			});
			
			this.game.addSprite(one);
			this.game.addSprite(two);
			this.game.addSprite(three);
			one.startMotion({
				vx: vx,
				vy: vy
			});
			two.startMotion({
				vx: vx*.9,
				vy: vy*.9
			});
			three.startMotion({
				vx: vx*.8,
				vy: vy*.8
			});
			
			
		}
	},
	
	jump: function() {
		this.isMoving = false;
		var animationData = {
			ay: 20,
			vy: -10,
			vxMax: null,
			vyMax: null,
			vxStop: 0,
			vyStop: null,
			yStop: this.y
		};
		if (this.vx > 0) {
			animationData.vx = this.vx + 5;
			animationData.ax = -2;
		}
		else if (this.vx < 0) {
			animationData.vx = this.vx - 5;
			animationData.ax = 2;
		}
		this.startMotion(animationData);
	},
	
	onKeyDownRight: function() {
		this.startMotion({
			ax: 5,
			vxMax: 3,
			vxStop: null
		});
		this.playSequence(Ext.create('Game.sprite.Sequence', {
			sequence: [18,3,33,3]
		}));
	},
	
	onKeyUpRight: function() {
		if (this.inputDevice.keysPressed.left) {
			this.onKeyDownLeft();
		}
		else {
			this.startMotion({
				ax: -3,
				vxStop: 0
			});
		}
	},
	
	onKeyDownLeft: function() {
		this.startMotion({
			ax: -5,
			vxMax: 3,
			vxStop: null
		});
		this.playSequence(Ext.create('Game.sprite.Sequence', {
			sequence: [17,2,32,2]
		}));
	},
	
	onKeyUpLeft: function() {
		if (this.inputDevice.keysPressed.right) {
			this.onKeyDownRight()
		}
		else {
			this.startMotion({
				ax: 3,
				vxStop: 0
			});
		}
	},
	
	onKeyDownUp: function() {
		this.startMotion({
			ay: -5,
			vyMax: 3,
			vyStop: null
		});
		this.playSequence(Ext.create('Game.sprite.Sequence', {
			sequence: [16,1,31,1]
		}));
	},
	
	onKeyUpUp: function() {
		if (this.inputDevice.keysPressed.down) {
			this.onKeyDownDown()
		}
		else {
			this.startMotion({
				ay: 3,
				vyStop: 0
			});
		}
	},
	
	onKeyDownDown: function() {
		this.startMotion({
			ay: 5,
			vyMax: 3,
			vyStop: null
		});
		this.playSequence(Ext.create('Game.sprite.Sequence', {
			sequence: [15,0,30,0]
		}));
	},
	
	onKeyUpDown: function() {
		if (this.inputDevice.keysPressed.up) {
			this.onKeyDownUp()
		}
		else {
			this.startMotion({
				ay: -3,
				vyStop: 0
			});
		}
	}
	
});