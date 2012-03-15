Ext.define('Game.sprite.Sprite', {
	extend: 'Game.sprite.Base',
	requires: [
		'Game.sprite.Sequence'
	],
	
	config: {
		img: null,
		src: false,
		hidden: false,
		currentFrame: 0
	},
	
	constructor: function() {
		this.callParent(arguments);
		this.createAndPlaySequence([0]);
		
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
		this.hidden = false;
		this.fireEvent('load', this);
	},
	
	getSequenceDurationFactor: function() {
		return 1;
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
//			this.context.drawImage(this.img.dom, 32, 0, this.width, this.height, this.x, this.y, this.width, this.height);
			
			// Update the current frame
			if (this.motion) {
				this.currentFrame = this.sequence.getFrame(this.motion.motionElapsedTime, this.getSequenceDurationFactor());
			}
			this.context.drawImage(this.img.dom, this.currentFrame * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);
		}
	},
	
	createAndPlaySequence: function(frameArray) {
		this.playSequence(new Game.sprite.Sequence({
			sequence: frameArray
		}));
	},
	
	playSequence: function(sequence) {
		this.sequence = sequence;
	}
	
});