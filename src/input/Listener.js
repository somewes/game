Ext.define('Game.input.Listener', {
	extend: 'Ext.util.Observable',
	requires: [
		'Game.sprite.Base'
	],
	
	config: {
		inputDevices: [],
		inputDevice: null
	},
	
	acceptInput: function(inputDevice) {
		this.initDeviceListeners(inputDevice);
		this.inputDevices.push(inputDevice);
		this.inputDevice = inputDevice;
	},
	
	initDeviceListeners: function(inputDevice) {
		inputDevice.on({
			scope: this,
			keydownspace: this.onKeyDownSpace,
			keyupspace: this.onKeyUpSpace,
			
			keydownup: this.onKeyDownUp,
			keyupup: this.onKeyUpUp,
			
			keydownright: this.onKeyDownRight,
			keyupright: this.onKeyUpRight,
			
			keydowndown: this.onKeyDownDown,
			keyupdown: this.onKeyUpDown,
			
			keydownleft: this.onKeyDownLeft,
			keyupleft: this.onKeyUpLeft,
			
			keydownf3: this.onKeyDownF3,
			keyupf3: this.onKeyUpF3
			
		});
	},
	
	onKeyDownSpace2: function() {
		this.game.addSprite(new Game.sprite.Base({
			randomize: true
		}));
	},
	
	onKeyDownSpace: Ext.emptyFn,
	onKeyUpSpace: Ext.emptyFn,
	onKeyDownUp: Ext.emptyFn,
	onKeyUpUp: Ext.emptyFn,
	onKeyDownRight: Ext.emptyFn,
	onKeyUpRight: Ext.emptyFn,
	onKeyDownDown: Ext.emptyFn,
	onKeyUpDown: Ext.emptyFn,
	onKeyDownLeft: Ext.emptyFn,
	onKeyUpLeft: Ext.emptyFn,
	onKeyDownF3: Ext.emptyFn,
	onKeyUpF3: Ext.emptyFn,
	
	
});