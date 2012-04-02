Ext.define('Game.sprite.DamageText', {
	extend: 'Game.sprite.Base',
	
	config: {
		color: '#000000',
		damage: 0,
		width: 200,
		height: 50,
		textSize: 16
	},
	
	constructor: function(config) {
		this.callParent(arguments);
		this.setColor(this.getColor());
		this.damage = this.damage < 0 ? -this.damage : this.damage;
	},
	
	getColor: function() {
		if (this.damage > 0) {
			return '#ffffff';
		}
		else {
			return '#00ff00';
		}
	},
	
	draw: function() {
		if (!this.hidden) {
			var context = this.getContext();
			context.fillStyle = this.color;
			context.font = this.textSize + 'pt Calibri';
			context.fillText(this.damage, this.x, this.y);
		}
	}
	
});