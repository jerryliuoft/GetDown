'use strict';

var RPG = RPG || {};
/**
* preload state that loads all assets and shows load bar
*
*/

RPG.PreloadState = function (game){

};
RPG.PreloadState.prototype= {

	preload: function() {

		//this.asset.cropEnabled = true;
		// load the sprite in the middle of the screen
		this.asset = this.add.sprite (RPG.GAME_WIDTH/2, RPG.GAME_HEIGHT/2, 'preloadBar');
		this.asset.anchor.setTo (0.5,0.5);
		//set this as preloader sprite
		this.load.setPreloadSprite(this.asset);

		// when this.ready turns true = game finished loading, load next state
		this.ready = false;
		// load a sprite for loader image
		this.preloadBar
		this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
        this.game.load.image("background", "img/background.png");
        this.game.load.image("title", "img/title.png");
        this.game.load.image("logo", "img/logo.png");
		this.game.load.image("character", "img/character.png");
		this.game.load.spritesheet("cloud", "img/cloud.png", 200,174);
		this.game.load.spritesheet("chicken", "img/chicken.png",75,58);
		this.game.load.spritesheet("bigchicken", "img/Bigchicken.png",500,392);
		//this.game.load.image("chicken", "img/chicken.png");
		this.game.load.image("coin", "img/coin.png");
		this.game.load.image("platform", "img/platform.png");
		this.game.load.image("test50x50", "img/character.png");
		this.game.load.image("gameover", "img/gameover.png");
		this.game.load.image("scoreboard", "img/scoreboard.png");
		this.game.load.spritesheet("start", "img/start.png",150,150);
		this.game.load.spritesheet("volume", "img/volume.png",50,50);
		this.load.bitmapFont('flappyfont', 'fonts/flappyfont/flappyfont.png', 'fonts/flappyfont/flappyfont.fnt');

		this.load.audio('coin_sound', 'sfx/Pickup_Coin.wav');
		this.load.audio('land_sound', 'sfx/land.wav');
		this.load.audio('dead_sound', 'sfx/dead.wav');


	},

	create:function (){

	},

	update:function (){
		if(this.ready){
			this.game.state.start('Menu');
		}
	},

	onLoadComplete: function(){
		this.ready = true;
	}
};