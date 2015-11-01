
Map = function(game) {
    
    this.game = game;



    this.ground = this.game.add.tileSprite(0,0,640,2272,'background');
    this.ground.autoScroll(0,-20);
    //this.ground = this.game.add.sprite(0,0,'background');

    // the layers of each item from bottom to top
    this.parallaxHolder2 = this.game.add.group();
    this.parallaxHolder1 = this.game.add.group();
    this.platformHolder = this.game.add.group();
    this.candyHolder = this.game.add.group();

    // bound holder for top bound and bottom bounds
    /////////////////////////////////////////////////////////////////////////
    this.boundHolder = this.game.add.group();

    var spikesTop = this.boundHolder.create(0,0,null);
    this.game.physics.arcade.enableBody(spikesTop);
    spikesTop.body.setSize  (640, 1, 0 , 0 );
    var spikesBottom = this.boundHolder.create(0,1135,null);
    this.game.physics.arcade.enableBody(spikesBottom);
    spikesBottom.body.setSize (640,1,0,0);
    ///////////////////////////////////////////////////////////////////////// 
    //end of bound holder


    // makePlatforms (interval, speed)
    
    this.parallaxBG(2, 100);
    //this.makeCandy(2, 300);
    this.makePlatforms(0.8, 220);
    


}

Map.prototype.makeCandy = function (interval, speed){

    this.candyGenerator = this.game.time.events.loop (Phaser.Timer.SECOND*interval, this.generateCandy, this, speed);
    this.candyGenerator.timer.start();


}

Map.prototype.generateCandy = function (speed){

    var tileWidth = this.game.cache.getImage("coin").width;
    var tileHeight = this.game.cache.getImage("coin").height;

    var y_pos = this.game.world.height + tileHeight;
    var x_pos = this.game.rnd.integerInRange(0,this.game.world.width- tileWidth);

    createCoins(this.game, x_pos, y_pos, 10, 10, this.candyHolder, speed);

}
//
// game is this game
// xpos ypos the position to have the coins generated
// row and column to set how many coins to generate; ie 3x4 will have 12 coins
//  coingroup holds teh coins to reuse
// speed of the coin going up;
function createCoins  (game, x_pos, y_pos, row, col,  coingroup, speed){

    var coin_img = "coin";
    var tileWidth = game.cache.getImage(coin_img).width;
    var tileHeight = game.cache.getImage(coin_img).height;

    for (var i =0; i < row; i ++){
        for (var j = 0; j <col; j++){
            
            var coin = coingroup.getFirstDead(false);
            if(!coin){
                coin = randomItem (game, x_pos+j*tileWidth, y_pos+i*tileHeight, speed, coin_img);
                coingroup.add(coin);
            }else{
                coin.reset(x_pos+j*tileWidth, y_pos+i*tileHeight);
            }
        }
    }


}


Map.prototype.makePlatforms = function(interval, speed) {

    //create the first platform for chicken to land


    
    this.platformGenerator = this.game.time.events.loop (Phaser.Timer.SECOND*interval, this.generatePlatform, this, speed);
    this.platformGenerator.timer.start();

    var firstplat = randomItem (this.game, 220, 1000, speed, 'platform');
    this.platformHolder.add( firstplat);

}

Map.prototype.generatePlatform = function (speed){

    //console.log("the speed of platform generation is " + speed );

    if (this.game.rnd.integerInRange(0,3)){ // 25% not generate platform

        var platformWidth = 200;
        var platformHeight = 20;

        var y_pos = this.game.world.height - platformHeight*2;
        var x_pos = this.game.rnd.integerInRange(0,this.game.world.width- platformWidth);

        console.log("number of platforms: "+ this.platformHolder.length);
        console.log("number of platforms alive: " + this.platformHolder.countLiving());
        console.log("number of platforms dead: " + this.platformHolder.countDead());


        var plat = this.platformHolder.getFirstDead(false);
        if(!plat){
            plat = randomItem (this.game, x_pos, y_pos, speed, 'platform');
            this.platformHolder.add( plat);

        }else{
            console.log("recreating platform");
            resetItem(this.game, plat, x_pos, y_pos, speed);
        } 
        
        
    }

}


 function randomItem(game, x, y, speed, itemimg){
    

    var item = game.add.sprite (x, y, itemimg);
    //this.anchor.setTo(0.5,0.5);
    game.physics.arcade.enableBody(item);
    item.body.allowGravity= false;
    item.body.immovable = true;
    item.body.velocity.y = - speed;
    //this.body.setSize(200, 20 , 0, 30);

    item.checkWorldBounds = true;
    item.outOfBoundsKill = true;
    //game.add.existing(this);

    return item;

};

function resetItem (game, item, x_pos, y_pos, speed){

    item.reset(x_pos, y_pos);
    game.physics.arcade.enableBody(item);
    item.body.allowGravity= false;
    item.body.immovable = true;
    item.body.velocity.y = - speed;
    //this.body.setSize(200, 20 , 0, 30);

    item.checkWorldBounds = true;
    item.outOfBoundsKill = true;
}



Map.prototype.parallaxBG = function (interval, speed){

    this.parallaxGenerator = this.game.time.events.loop (Phaser.Timer.SECOND*interval, this.generateParallax, this, speed);
    this.parallaxGenerator.timer.start();

}


Map.prototype.generateParallax = function (speed){
    //console.log("creating parallax");
    var layer = this.game.rnd.integerInRange(0,4) ;
    if (layer){ // 25% not generate platform

        var platformWidth = 200;
        var platformHeight = 20;
        var scaleFactor = this.game.rnd.realInRange(0.3, 1.2);
        var y_pos = this.game.world.height + platformHeight*2;
        var x_pos = this.game.rnd.integerInRange(0,this.game.world.width- (platformWidth*scaleFactor));


        var plat;
        

        
        
        if ( layer == 1){
            plat = this.parallaxHolder2.getFirstDead(false);
            if(!plat){
                plat = randomItem (this.game, x_pos, y_pos, speed/2, 'cloud');
                this.parallaxHolder2.add( plat);
            }else{                
                resetItem(this.game, plat, x_pos, y_pos, speed/2);
                
            } 

            plat.alpha = 0.5;
            
        }else{
            plat = this.parallaxHolder1.getFirstDead(false);
            if(!plat){
                plat = randomItem (this.game, x_pos, y_pos, speed, 'cloud');
                this.parallaxHolder1.add( plat);

            }else{

                resetItem(this.game, plat, x_pos, y_pos, speed);
            } 
            
        }
        plat.scale.setTo(scaleFactor, scaleFactor);
        plat.frame = this.game.rnd.integerInRange(0,4);
        
    }

}


