Ext.define('Game.animation.Animate', {
	extend: 'Ext.util.Observable',
	
	config: {
		animation: null,
		animations: null,
		motion: null
	},
	
	animate: function(config) {
		if (!this.animations) {
			this.animations = new Ext.util.MixedCollection();
		}
		else if (this.motion) {
			this.motion.stopMotion();
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
		
		return animation;
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
	},
	
	clearAnimations: function() {
		if (this.animations) {
			this.animations.clear();
			this.onAnimationStop(this.animation);
		}
	},
	
	startMotion: function(config) {
		if (!this.animations) {
			this.animations = new Ext.util.MixedCollection();
		}
		if (this.animation) {
			this.clearAnimations();
		}
		
		if (!this.motion) {
			this.motion = Ext.create('Game.animation.Motion', Ext.apply({
				target: this
			}, config));
			this.motion.on({
				scope: this,
				start: this.onMotionStart,
				stop: this.onMotionStop
			});
		}
		
		this.motion.startMotion(config);
		return this.motion;
	},
	
	onMotionStart: function(motion) {
		this.game.animationManager.add(motion);
	},
	
	onMotionStop: function(motion) {
		this.game.animationManager.remove(motion);
		delete this.motion;
	}
	
});