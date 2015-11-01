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
        var scoreFont = "100px Arial";
        var scoreAnimation = this.game.add.text(30, 100, "Press or Swipe Left and Right to Move", {font: scoreFont, fill: "#39d179", stroke: "#ffffff", strokeThickness: 10, wordWrap: true, wordWrapWidth: 600}); 
        this.add.button(280, 800, 'start', this.startGame, this);

    },

    startGame: function () {
        // Change the state to the actual game.
        this.state.start('Game');

    }

};