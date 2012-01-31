Ext.define('Game.input.Keyboard', {
	extend: 'Ext.util.Observable',
	
	config: {
		game: null
	},
	
	keyDown: false,
	keysPressed: {
//		87: false, //up
//		68: false, //right
//		83: false, //down
//		65: false, //left
//		32: false //space
	},
	
	keyValues: {
		up: 87,
		right: 68,
		down: 83,
		left: 65,
		space: 32
	},
	
	keyMap: null,
	
	constructor: function(config) {
		this.initConfig(config);
		this.callParent(arguments);
		this.init();
	},

	init: function() {
		this.initKeyMap();
		this.initControls();
	},
	
	initKeyMap: function() {
		this.keysPressed = {};
		this.keyMap = {};
		for (var i in this.keyValues) {
			this.keyMap[this.keyValues[i]] = i;
			this.keysPressed[i] = false;
		}
	},
	
	initControls: function() {
		Ext.get(document).on('keydown', this.onKeyDown, this);
		Ext.get(document).on('keyup', this.onKeyUp, this);
	},

	onKeyDown: function(e) {
		// Do not run key events if the game is blocking user input
		if (this.game.ignoreInput) {
			return;
		}
		
		// Do not keep firing the key down event for the same key
		if (this.keysPressed[this.keyMap[e.keyCode]] === true) {
			return;
		}
		
		this.keysPressed[this.keyMap[e.keyCode]] = true;
		this.fireEvent('keydown' + this.keyMap[e.keyCode]);
	},
	
	onKeyUp: function(e) {
		this.keysPressed[this.keyMap[e.keyCode]] = false;
		this.fireEvent('keyup' + this.keyMap[e.keyCode]);
	}
	
});