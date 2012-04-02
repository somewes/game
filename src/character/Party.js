Ext.define('Game.character.Party', {
	extend: 'Ext.util.Observable',
	requires: [
		'Game.canvas.Drawable'
	],
	mixins: {
		drawable: 'Game.canvas.Drawable'
	},
	
	config: {
		characters: null
	},
	
	constructor: function(config) {
		this.initConfig(config);
		this.callParent(arguments);
		this.characters = new Ext.util.MixedCollection;
	},
	
	addCharacter: function(character) {
		character.on('remove', this.removeCharacter, this);
		this.characters.add(character.getId(), character);
		character.party = this;
		this.fireEvent('characteradd', this, character);
	},
	
	removeCharacter: function(character) {
		this.characters.remove(character);
		delete character.party;
		this.fireEvent('characterremove', this, character);
	},
	
	getLevelSum: function() {
		var sum = 0;
		var numCharacters = this.characters.items.length;
		for (var i = 0; i < numCharacters; i++) {
			sum += this.characters.items[i].level;
		}
		return sum;
	}
	
});