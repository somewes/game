Ext.define('Game.sprite.Sequence', {
	extend: 'Ext.util.Observable',
	
	config: {
		sequence: [0],
		duration: 1000,
		numFrames: 1
	},
	
	constructor: function(config) {
		this.initConfig(config);
		this.callParent(arguments);
		this.numFrames = this.sequence.length;
	},
	
	getFrame: function(elapsedTime, durationFactor) {
		if (!durationFactor) {
			durationFactor = 1;
		}
		var percentage = elapsedTime / this.duration * durationFactor;
		var frame = Math.round(percentage * this.numFrames) % this.numFrames;
		return this.sequence[frame];
	}
	
});