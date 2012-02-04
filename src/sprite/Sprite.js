Ext.define('Game.sprite.Sprite', {
	extend: 'Game.sprite.Base',
	
	config: {
		img: null,
		src: false,
		hidden: false,
		currentFrame: 0
	},
	
	constructor: function() {
		this.callParent(arguments);
		
		this.img = Ext.get(new Image());
		this.img.dom.width = this.width;
		this.img.dom.height = this.height;
		this.img.on('load', function() {
			this.onLoad();
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
		this.playSequence(Ext.create('Game.sprite.Sequence', {
			sequence: [0]
		}));
		this.hidden = false;
		this.fireEvent('load', this);
	},
	
	updatePosition: function(currentTime) {
		this.callParent(arguments);
		
		// Update the current frame
		this.currentFrame = this.sequence.getFrame(this.motionElapsedTime, this.getSequenceDurationFactor());
	},
	
	getSequenceDurationFactor: function() {
		if (this.dx > this.dy) {
			return Math.round(this.dx/2, 2);
		}
		else {
			return Math.round(this.dy/2, 2);
		}
	},
	
	draw: function() {
		if (!this.hidden) {
			var context = this.getContext();
//			this.context.drawImage(this.img.dom, this.getFrame() * this.width, 0, this.width, this.height, this.x, this.y-32, this.width, this.height);
			this.context.drawImage(this.img.dom, this.currentFrame * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);
			return;
			if (this.isAnimating) {
				context.font = '18pt Calibri';
				context.fillText(this.animation.stopTime.getTime() - this.currentTime.getTime() , this.x, this.y);
			}
		}
	},
	
	playSequence: function(sequence) {
		this.sequence = sequence;
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
		this.startMotion({
			ax: -3,
			vxStop: 0
		});
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
		this.startMotion({
			ax: 3,
			vxStop: 0
		});
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
		this.startMotion({
			ay: 3,
			vyStop: 0
		});
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
		this.startMotion({
			ay: -3,
			vyStop: 0
		});
	}
	
});