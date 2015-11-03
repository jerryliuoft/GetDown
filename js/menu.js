'use strict';
var RPG = RPG || {};

RPG.MenuState = function (game) {};

RPG.MenuState.prototype = {

    preload : function() {
        
    
    },

    create: function () {

        //game.world.setBounds(0, 0, 1920, 1920);
        // Add menu screen.
        // It will act as a button to start the game.
        //var scoreFont = "100px Arial";
        //var scoreAnimation = this.game.add.text(30, 100, "Press or Swipe Left and Right to Move", {font: scoreFont, fill: "#39d179", stroke: "#ffffff", strokeThickness: 10, wordWrap: true, wordWrapWidth: 600}); 
        
        this.game.add.image (0,0, "title");
        var logo = this.game.add.sprite (this.game.width/2, 200, 'logo');
        logo.anchor.setTo(0.5, 0.5);
        logo.alpha =0;
        //to(properties, duration, ease, autoStart, delay, repeat, yoyo) → {Phaser.Tween}
        this.game.add.tween(logo).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0, 0, false);

        this.game.add.tween(logo).to({y:180}, 700, Phaser.Easing.Linear.NONE, true, 0, 1000, true);

        var startButton = this.add.button(this.game.width/2, 1400, 'start', this.startGame, this,0,0,1);
        startButton.anchor.setTo(0.5,0.5);

        this.game.add.tween(startButton).to({y:1000}, 500, Phaser.Easing.Linear.NONE, true, 0, 0, false);
        //
        var chicken = this.game.add.sprite (this.game.width/2, 710, 'bigchicken');
        chicken.frame = this.game.rnd.integerInRange(0,5);
        chicken.anchor.setTo(0.5,0.5);


    },

    startGame: function () {
        // Change the state to the actual game.
        this.state.start('Game');

    }

};

