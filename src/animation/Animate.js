Ext.define('Game.animation.Animate', {
	extend: 'Ext.util.Observable',
	
	config: {
		animation: null,
		animations: null
	},
	
	animate: function(config) {
		if (!this.animations) {
			this.animations = new Ext.util.MixedCollection();
		}
		
		config.target = this;
		
		// Create the animation
		var animation = Ext.create('Game.animation.Animation', config);
		animation.on({
			scope: this,
			start: this.onAnimationStart,
			stop: this.onAnimationStop
		});
		
		// Enqueue the animation
		this.addAnimation(animation);
		
		this.startNextAnimation();
		
		return this;
	},
	
	addAnimation: function(animation) {
		this.animations.add(animation.id, animation);
	},
	
	removeAnimation: function(animation) {
		this.animations.remove(animation);
	},
	
	onAnimationStart: function(animation) {
		this.game.animationManager.add(animation);
	},
	
	onAnimationStop: function(animation) {
		this.removeAnimation(animation);
		this.game.animationManager.remove(animation);
		delete this.animation;
		this.startNextAnimation();
	},
	
	startNextAnimation: function() {
		// Start if not animating
		if (!this.animation && this.animations.items.length) {
			this.animation = this.animations.items[0];
			this.animation.start();
		}
	}
	
});