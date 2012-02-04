Ext.define('Game.sprite.Sprite', {
	extend: 'Game.sprite.Base',
	
	config: {
		img: null,
		src: false,
		hidden: false
	},
	
	constructor: function() {
		this.callParent(arguments);
		
		this.img = Ext.get(new Image());
		this.img.dom.width = this.width;
		this.img.dom.height = this.height;
		this.img.on('load', function() {
			this.load(this.src);
		}, this);
		this.load(this.src);
	},
	
	load: function(src) {
		if (src) {
			this.src = src;
			this.img.dom.src = src;
		}
	},
	
	onLoad: function() {
		this.hidden = false;
		this.fireEvent('load', this);
	},
	
	draw: function() {
		if (!this.hidden) {
			var context = this.getContext();
//			this.context.drawImage(this.img.dom, this.getFrame() * this.width, 0, this.width, this.height, this.x, this.y-32, this.width, this.height);
			this.context.drawImage(this.img.dom, 0, 0, this.width, this.height, this.x, this.y, this.width, this.height);
			return;
			if (this.isAnimating) {
				context.font = '18pt Calibri';
				context.fillText(this.animation.stopTime.getTime() - this.currentTime.getTime() , this.x, this.y);
			}
		}
	},
	
	getFrame: function() {
		return this.currentAnimation.sequence[(Math.round(this.game.frameCount / this.currentAnimation.fpf) % this.currentAnimation.sequence.length)];
	},
	
	onKeyDownRight: function() {
		this.startMotion({
			ax: 5,
			vxMax: 5,
			vxStop: null
		});
	},
	
	onKeyUpRight: function() {
		this.startMotion({
			ax: -3,
			vxStop: 0
		});
	},
	
	onKeyDownLeft: function() {
		this.startMotion({
			ax: -5,
			vxMax: 5,
			vxStop: null
		});
	},
	
	onKeyUpLeft: function() {
		this.startMotion({
			ax: 3,
			vxStop: 0
		});
	},
	
	onKeyDownUp: function() {
		this.startMotion({
			ay: -5,
			vyMax: 5,
			vyStop: null
		});
	},
	
	onKeyUpUp: function() {
		this.startMotion({
			ay: 3,
			vyStop: 0
		});
	},
	
	onKeyDownDown: function() {
		this.startMotion({
			ay: 5,
			vyMax: 5,
			vyStop: null
		});
	},
	
	onKeyUpDown: function() {
		this.startMotion({
			ay: -3,
			vyStop: 0
		});
	}
	
});