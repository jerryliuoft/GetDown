'use strict';
var RPG = RPG || {};

RPG.mute = false;

RPG.GameState = function (game){};
RPG.GameState.prototype = {

    preload : function() {
    // anything here should be in the preloader
    },

    create: function () {
        //this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        //need to set portrait orientation

        // set world height higher so there's more room for stuff to fly in before it gets killed by outof boudns kill
        this.game.world.setBounds(0, 0, 640, 2000);


        this.game_map = new Map(this.game);
        // function : Player(game, x, y, player, gravity, speed)

        this.player = new Player(this.game, 320, 100, "chicken", 1500, 350);

        this.score = 0;
        this.scoreBuffer = 0;
        this.scoreText = this.game.add.bitmapText(this.game.width/2, 10, 'flappyfont', this.score.toString(),80);
        this.scoreText.visible = true;

        this.scoreText.align = 'center';
        this.scoreLabelTween = this.add.tween(this.scoreText.scale).to({ x: 1.5, y: 1.5}, 200, Phaser.Easing.Linear.In).to({ x: 1, y: 1}, 200, Phaser.Easing.Linear.In);

        this.scoreboard = new Scoreboard (this.game);
        /*
        // debug
        this.add.button(280, 900, 'start', this.increaseSpeed, this);
        this.add.button(280, 1000, 'start', this.decreaseSpeed, this);

        //this.game_map.fever(20, 'cake', 30, this.player);

    */

        this.coinSound= this.game.add.audio('coin_sound');
        this.landSound= this.game.add.audio('land_sound');
        this.deadSound= this.game.add.audio('dead_sound');



        //console.log ("game height: "+ this.game.height+ " world height: "+this.game.world.height);

        this.volumeButton = this.add.button(this.game.width- 100, 30, 'volume', this.mutesound, this,0,0,1);
        this.volumeButton.anchor.setTo(0.5,0.5);
        if (!RPG.mute){
            this.volumeButton.setFrames(0, 0, 1);
        }else{
            this.volumeButton.setFrames(2, 2, 3);

        }






    },
    update : function (){
        this.game.physics.arcade.collide (this.player, this.game_map.platformHolder, this.platformHandler,null,this);
        this.game.physics.arcade.overlap(this.player, this.game_map.boundHolder, this.gameOverHandler, null, this);
        this.game.physics.arcade.overlap (this.player, this.game_map.coinHolder, this.candyHandler, null, this);
        

        if (this.scoreBuffer > 0){

            if (this.scoreBuffer > 100){
                this.incrementScore(10);
                this.scoreBuffer -=10;
            }else{
                this.incrementScore(1);
                this.scoreBuffer -- ;
            }
        }



    },
    /*
    render : function (){

        this.game.debug.text("Current speed is "+ this.player.movespeed, 32, 130);
        //this.game.debug.inputInfo(32, 32);
    },
    */
    mutesound: function (){
        if (RPG.mute){
            this.volumeButton.setFrames(0, 0, 1);
            this.game.sound.mute = false;
            RPG.mute=false;

        }else{
            this.volumeButton.setFrames(2, 2, 3);
            this.game.sound.mute = true;
            RPG.mute=true;

        }

    },
    incrementScore: function (num) {
        this.score +=num;
        this.scoreText.setText (this.score.toString());
        this.scoreText.x = this.game.width/2 - (this.scoreText.textWidth/2);
    },
    increaseSpeed: function () {
        this.player.movespeed += 10;
        console.log("current speed: " + this.player.movespeed);

    },
    decreaseSpeed: function () {
        this.player.movespeed -= 10;
        console.log("current speed: " + this.player.movespeed);

    },
    
    createScoreAnimation: function(x, y, message, score){
     
        var me = this;
     
        var scoreFont = "40px Arial";
     
        //Create a new label for the score
        var scoreAnimation = me.game.add.text(x, y, message, {font: scoreFont, fill: "#39d179", stroke: "#ffffff", strokeThickness: 20}); 
        scoreAnimation.anchor.setTo(0.5, 0);
        scoreAnimation.align = 'center';
     
        //Tween this score label to the total score label
        var scoreTween = me.game.add.tween(scoreAnimation).to({x:me.game.world.centerX, y: 50}, 800, Phaser.Easing.Exponential.In, true);
     
        //When the animation finishes, destroy this score label, trigger the total score labels animation and add the score
        scoreTween.onComplete.add(function(){
            scoreAnimation.destroy();
            me.scoreLabelTween.start();
            me.scoreBuffer += score;
        }, me);
    },

    gameOverHandler :function (){
        this.scoreboard.show(this.score);
        this.scoreText.visible = false;
        //this.deadSound.play();
        this.player.kill();
    },
    platformHandler : function (player, platform){
        if (!platform.played){
            this.landSound.play();
            platform.played = true;
        }
        
    },


    candyHandler :function (player, candy){

        this.scoreBuffer += 5;
        this.createScoreAnimation(player.x + player.width/2, candy.y, '+5', 5);
        candy.kill ();
        this.coinSound.play();
    }


    
};

