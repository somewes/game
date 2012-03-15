Ext.define('Game.ui.Main', {
	extend: 'Game.canvas.Canvas',
	
	config: {
		twoPi: 0,
		circleY: 0,
		radius: 30,
		halfRadius: 0,
		lifeX: 0,
		lifeY: 0,
		manaX: 0,
		manaY: 0
	},
	
	constructor: function() {
		this.callParent(arguments);
		this.camera = this.game.camera;
		this.twoPi = Math.PI * 2;
		this.halfRadius = this.radius / 2;
		this.lifeX = this.radius;
		this.lifeY = this.camera.height - this.radius;
		this.manaX = this.camera.width - this.radius;
		this.manaY = this.camera.height - this.radius;
	},
	
	draw: function() {
		var player = this.game.player;
		this.context.save();
		this.context.translate(this.camera.x, this.camera.y);
		
		// Draw life
		this.context.beginPath();
		
//		this.context.arc(this.lifeX, this.lifeY, this.radius, 0, this.twoPi, true);
		var startX = 400;
		var lostX = (this.height - startX) * player.getLifePercent();
		var gradient = this.context.createLinearGradient(40, 400, 0, this.height);
		gradient.addColorStop(0, "#FF001D");
		gradient.addColorStop(1, "#780006");
		this.context.fillStyle = gradient;
		this.context.fillRect(0, this.height - lostX, 40, this.height);
//		this.context.closePath();
//		this.context.fill();
		
		// Draw mana
//		this.context.beginPath();
//		this.context.arc(this.manaX, this.manaY, this.radius, 0, this.twoPi, true);
//		this.context.closePath();
		lostX = (this.height - startX) * player.getManaPercent();
		gradient = this.context.createLinearGradient(600, 400, this.width, this.height);
		gradient.addColorStop(0, "#8ED6FF");
		gradient.addColorStop(1, "#004CB3");
		this.context.fillStyle = gradient;
		this.context.fillRect(600, this.height - lostX, this.width, this.height);
//		this.context.fill();
		
		this.context.restore();
	}
	
});