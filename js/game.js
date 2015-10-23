'use strict';
var RPG = RPG || {};


RPG.GameState = function (game){};
RPG.GameState.prototype = {

    preload : function() {
    // anything here should be in the preloader
    },

    create: function () {
        //this.game.physics.startSystem(Phaser.Physics.ARCADE);

        /**
        *Map = function(game, floor, wall, min_room_size, max_room_size, max_room_number)
        *These parameters are here for example. The required parameters are:
        *The image for the floor tiles (ex. 'floor') Change in the class
        *The image for the wall tiles (ex. 'wall') Change in the class incase more image is needed
        *Minimum room size (in tiles) (ex.  2)
        *Maximum room size (in tiles) (ex. 5)
        *Maximum number of rooms possible (ex. 10)
        *
        */
        //this.game.world.setBounds(0, 0, 640, 480);
        //this.game.world.setBounds(0, 0, 4096, 3072);
        this.background = this.game.add.sprite (0,0,'background');
        //this.background.autoScroll(-20,0); // make sky move
        //this.game_map = new Map(this.game,2,10,7);



        //this.player = new Player(this.game, this.game_map.player_x, this.game_map.player_y, this.game_map.maps, this.game_map.floors);



    },
    update : function (){



    }


};






