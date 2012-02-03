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
	
	onKeyDownRight: function(config) {
		config = config || {};
		if (this.animation && this.animation.isRunning) {
			return;
		}
		this.animate({
			duration: config.duration || 500,
			to: {
				x: config.x || this.x + 32
			},
			easing: Ext.fx.Easing.ease,
			on75: function() {
				return;
				if (this.deviceInput.keysPressed.right) {
					Ext.apply(this.animation, {
						duration: this.animation.remainingTime + 500,
						to: {
							x: this.animation.stopX + 32
						}
					});
					this.animation.init();
				}
			},
			onStop: function() {
				this.onKeyDownRight();
			}
		});
	},
	
	onKeyUpRight: function() {
		
	}
	
});