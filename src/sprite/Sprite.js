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
		this.playSequence(Ext.create('Game.sprite.Sequence', {
			sequence: [0]
		}));
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
//			this.context.drawImage(this.img.dom, 32, 0, this.width, this.height, this.x, this.y, this.width, this.height);
			this.context.drawImage(this.img.dom, this.currentFrame * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);
		}
	},
	
	playSequence: function(sequence) {
		this.sequence = sequence;
	}
	
});