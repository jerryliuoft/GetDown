'use strict';
var RPG = RPG || {};


RPG.GameState = function (game){};
RPG.GameState.prototype = {

    preload : function() {
    // anything here should be in the preloader
    },

    create: function () {
        // fullscreen or not
        //this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        this.game.world.setBounds(0, 0, 640, 1500);


        this.game_map = new Map(this.game);
        // function : Player(game, x, y, player, gravity, speed)

        this.player = new Player(this.game, 350, 100, "chicken", 1500, 350);

        this.score = 0;
        this.scoreBuffer = 0;
        this.scoreText = this.game.add.bitmapText(this.game.width/2, 10, 'flappyfont', this.score.toString(),80);
        this.scoreText.visible = true;
        //this.scoreText.anchor.setTo(0.5,0);
        this.scoreText.align = 'center';
        this.scoreLabelTween = this.add.tween(this.scoreText.scale).to({ x: 1.5, y: 1.5}, 200, Phaser.Easing.Linear.In).to({ x: 1, y: 1}, 200, Phaser.Easing.Linear.In);

        this.scoreboard = new Scoreboard (this.game);
        /*
        // debug
        this.add.button(280, 900, 'start', this.increaseSpeed, this);
        this.add.button(280, 1000, 'start', this.decreaseSpeed, this);

        //this.game_map.fever(20, 'cake', 30, this.player);

    */





    },
    update : function (){
        this.game.physics.arcade.collide (this.player, this.game_map.platformHolder);
        this.game.physics.arcade.overlap(this.player, this.game_map.boundHolder, this.gameOverHandler, null, this);
        this.game.physics.arcade.overlap (this.player, this.game_map.candyHolder, this.candyHandler, null, this);
        

        if (this.scoreBuffer > 0){
            this.incrementScore();
            this.scoreBuffer -- ;
        }


    },
    /*
    render : function (){

        this.game.debug.text("Current speed is "+ this.player.movespeed, 32, 130);
        //this.game.debug.inputInfo(32, 32);
    },
    */
    incrementScore: function () {
        this.score +=1;
        this.scoreText.setText (this.score.toString());  
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
        this.player.kill();
    },



    candyHandler :function (player, candy){

        this.scoreBuffer += 5;
        this.createScoreAnimation(player.x + player.width/2, candy.y, '+5', 5);
        candy.kill ();
    }


    
};

