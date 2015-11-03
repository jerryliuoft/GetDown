
Map = function(game) {
    
    this.game = game;





    this.ground = this.game.add.tileSprite(0,0,640,2272,'background');
    this.ground.autoScroll(0,-20);
    //this.ground = this.game.add.sprite(0,0,'background');

    // the layers of each item from bottom to top
    this.parallaxHolder2 = this.game.add.group();
    this.parallaxHolder1 = this.game.add.group();
    this.platformHolder = this.game.add.group();
    this.coinHolder = this.game.add.group();

    // bound holder for top bound and bottom bounds
    /////////////////////////////////////////////////////////////////////////
    this.boundHolder = this.game.add.group();

    var spikesTop = this.boundHolder.create(0,0,null);
    this.game.physics.arcade.enableBody(spikesTop);
    spikesTop.body.setSize  (640, 1, 0 , -30 );
    var spikesBottom = this.boundHolder.create(0,1135,null);
    this.game.physics.arcade.enableBody(spikesBottom);
    spikesBottom.body.setSize (640,1,0,0);
    ///////////////////////////////////////////////////////////////////////// 
    //end of bound holder


    // makePlatforms (interval, speed)
    
    this.parallaxBG(2, 100);
    this.makeCoin(1.3, 400);
    //this.makePlatforms(0.8, 220);
    this.makePlatforms(0.6, 300);
    


}

Map.prototype.makeCoin = function (interval, speed){

    this.coinGenerator = this.game.time.events.loop (Phaser.Timer.SECOND*interval, this.generateCoin, this, speed);
    this.coinGenerator.timer.start();


}

Map.prototype.generateCoin = function (speed){

    var tileWidth = this.game.cache.getImage("coin").width;
    var tileHeight = this.game.cache.getImage("coin").height;

    var num_row = 5;
    var num_col = 5;

    var y_pos = this.game.height + tileHeight*num_row;
    var x_pos = this.game.rnd.integerInRange(0,this.game.width- tileWidth*num_col);

    var shape = coinShapes('L');

    createCoins(this.game, x_pos, y_pos, num_row, num_col, this.coinHolder, speed, shape);

}

//
// game is this game
// xpos ypos the position to have the coins generated
// row and column to set how many coins to generate; ie 3x4 will have 12 coins
//  coingroup holds teh coins to reuse
// speed of the coin going up;
// shape of the coin
function createCoins  (game, x_pos, y_pos, row, col,  coingroup, speed, shape){

    console.log("making coins")

    var coin_img = "coin";
    var tileWidth = game.cache.getImage(coin_img).width;
    var tileHeight = game.cache.getImage(coin_img).height;

    //var coin = randomItem (game, x_pos, y_pos, speed, coin_img);
 

    for (var i =0; i < row; i ++){
        for (var j = 0; j <col; j++){
            if(shape[i][j]){
                var coin = coingroup.getFirstDead(false);
                if(!coin){
                    coin = randomItem (game, x_pos+j*tileWidth, y_pos+i*tileHeight, speed, coin_img);
                    coingroup.add(coin);
                }else{
                    resetItem (game, coin, x_pos+j*tileWidth, y_pos+i*tileHeight, speed);
                }

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

        var y_pos = this.game.height + platformHeight*2;
        var x_pos = this.game.rnd.integerInRange(0,this.game.width- platformWidth);

        //console.log("number of platforms: "+ this.platformHolder.length);
        //console.log("number of platforms alive: " + this.platformHolder.countLiving());
        //console.log("number of platforms dead: " + this.platformHolder.countDead());


        var plat = this.platformHolder.getFirstDead(false);
        if(!plat){
            plat = randomItem (this.game, x_pos, y_pos, speed, 'platform');
            this.platformHolder.add( plat);

        }else{
            //console.log("recreating platform");
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

    //reset sound
    item.played = false;
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
        var y_pos = this.game.height + platformHeight*2;
        var x_pos = this.game.rnd.integerInRange(0,this.game.width- (platformWidth*scaleFactor));


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



function coinShapes (shape){

    var lookup = [];
    var shapes = [];



    var Template =[
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
    ];
    lookup['template'] = Template;


    var L = [
    [1, 1, 0, 0, 0],
    [1, 1, 0, 0, 0],
    [1, 1, 0, 0, 0],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1]
    ];
    lookup['L'] = L;
    shapes.push(L);

    var up_arrow =[
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 0, 0, 0, 1]
    ];
    lookup['up_arrow'] = up_arrow;
    shapes.push(up_arrow);


    var O =[
    [0, 1, 1, 1, 0],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [0, 1, 1, 1, 0]
    ];
    lookup['O'] = O;
    shapes.push(O);

    var V =[
    [1, 0, 0, 0, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0],
    [0, 0, 1, 0, 0]
    ];
    lookup['V'] = V;
    shapes.push(V);

    var E = [
    [1, 1, 1, 1, 1],
    [1, 1, 0, 0, 0],
    [1, 1, 1, 1, 1],
    [1, 1, 0, 0, 0],
    [1, 1, 1, 1, 1]
    ];
    lookup['E'] = E;
    shapes.push(E);

    var Dimond = [
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0],
    [0, 0, 1, 0, 0]
    ];
    lookup['Dimond'] = Dimond;
    shapes.push(Dimond);

    var heart = [
    [0, 1, 0, 1, 0],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0],
    [0, 0, 1, 0, 0]
    ];
    lookup['heart'] = heart;
    shapes.push(heart);

    var forward_slash=[
    [0, 0, 0, 1, 1],
    [0, 0, 1, 1, 1],
    [0, 1, 1, 1, 0],
    [1, 1, 1, 0, 0],
    [1, 1, 0, 0, 0]
    ];
    lookup['forward_slash'] = forward_slash;
    shapes.push(forward_slash);
    var back_slash=[
    [1, 1, 0, 0, 0],
    [1, 1, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 1, 1, 1],
    [0, 0, 0, 1, 1]
    ];
    lookup['back_slash'] = back_slash;
    shapes.push(back_slash);


    var plus=[
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0]
    ];
    lookup['plus'] = plus;
    shapes.push(plus);
    

    

    var item = shapes[Math.floor(Math.random()*shapes.length)];

    return item;
}