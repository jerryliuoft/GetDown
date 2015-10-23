// Some features,
// all the walls are in this.walls, all the floors are in this.floors
// player stats are in this.playerstates


Map = function(game, min_room_size, max_room_size, max_room_number) {
    
    //lets initiate some parameters
    //tile sizses in pixels

    this.floor_tile_size_height = 100;
    this.floor_tile_size_width = 100;
    this.tile_offset_x =0;
    this.tile_offset_y =0;
    //this.floor_image = ["grass", "wood", "plain", "dirt", "grass", "grass"] ;
    this.floor_image = ["grass"];
    this.wall_image = null;
    this.tree_image= ["tree_short", "tree_tall", "tree_ugly", "rock"];
    this.tree_chance = 2;


    //group that holds the walkable tiles
    this.floors = game.add.group();  
    //group that holds the walls or any immovable objects
    this.walls = game.add.group();
    this.walls.enableBody = true;
    
    this.game = game;  

    //set the map array with empty tiles
    this.maps = [];
    for (var x = 0; x <= this.game.world.width/this.floor_tile_size_width ; x++){
        this.maps [x] = [];
        for (var y = 0; y <= this.game.world.height/this.floor_tile_size_height ; y++){
            this.maps[x][y] = new this.Tile (x , y, null);
        }
    }

    // set the min room size interms of tiles
    this.room_min_size = min_room_size;
    this.room_max_size = max_room_size;
    this.max_rooms = max_room_number;

    
    //variables to track the room numbers
    this.lastRoomCoords = {x:0, y:0};
    this.num_rooms = 0;
    this.num_tiles = 0;

    // variables to initiate starting position
    this.player_x= 0;
    this.player_y= 0;
    this.destination_x = 0;
    this.destination_y = 0;

    // pass in the game variable so that it can find game
    this.makeMap();
    // add the actual tiles of the map
    this.renderMap();
    //create destination;
    this.createDestination(this.destination_x , this.destination_y, "Princess");
    // create some trees on the map
    this.createTrees(10);

}
//Tile Object to hold informations of the map array

Map.prototype.Tile = function (x,y,image){

    this.floor_tile_size_height = 80;
    this.floor_tile_size_width = 100;

    this.x_index = x;
    this.y_index = y;
    this.x =x * this.floor_tile_size_width;
    this.y =y * this.floor_tile_size_height;
    this.image = image;
    this.has_player = false;
    this.has_enemy = false;
    this.has_object = false;
    this.empty = true;
    this.movable= false;
    this.end = false;

}

//create a room,
Map.prototype.Room = function(x, y, w, h) {
    this.x1 = x;
    this.y1 = y;
    this.x2 = x + w;
    this.y2 = y + h;

    var center_x = (this.x1 + this.x2) / 2;
    var center_y = (this.y1 + this.y2) / 2;
    this.center_coords = {x: center_x, y: center_y};    
}

//create a floor, if not empty add a floor tile
Map.prototype.createFloor = function(x, y) {

    var x_index =x/this.floor_tile_size_width;
    var y_index =y/this.floor_tile_size_height;

    if (this.maps[x_index][y_index].empty){ // nothing exists
        this.maps[x_index][y_index].empty = false;
        this.maps[x_index][y_index].movable = true;
        this.maps[x_index][y_index].image = this.floor_image[this.game.rnd.integerInRange(0,this.floor_image.length-1)];

    }

}

Map.prototype.createRoom = function(x1, x2, y1, y2) {
    for (var x = x1; x<x2; x+=this.floor_tile_size_width) {
        for (var y = y1; y<y2; y+=this.floor_tile_size_height) {

            this.createFloor(x, y);

        }
    }
}

Map.prototype.createHTunnel = function(x1, x2, y) {
    var min = Math.min(x1, x2);
    var max = Math.max(x1, x2);
    for (var x = min; x<=max; x+=this.floor_tile_size_width) {
        this.createFloor(x, y);
    }

}
Map.prototype.createVTunnel = function(y1, y2, x) {
    var min = Math.min(y1, y2);
    var max = Math.max(y1, y2);
    for (var y = min; y<=max; y+=this.floor_tile_size_height) {      
        this.createFloor(x, y);
    }    

}
// add a tree at x ,y
Map.prototype.createDestination = function (x, y, image){
    var x_index =x/this.floor_tile_size_width;
    var y_index =y/this.floor_tile_size_height;

    this.maps[x_index][y_index].end = true;
    this.maps[x_index][y_index].movable = false;
    this.walls.create(this.maps[x_index][y_index].x, this.maps[x_index][y_index].y, image);

}

Map.prototype.createTrees = function (num){

    var y_offset = 20;

    while(num >0){
        var startPos = this.floors.getRandom();
        if (this.maps[startPos.data.x_index][startPos.data.y_index].has_object ==false){
            num --;
            tree = this.walls.create(startPos.x, startPos.y-y_offset, this.tree_image[this.game.rnd.integerInRange(0, this.tree_image.length-1)]); 
            this.maps[startPos.data.x_index][startPos.data.y_index].has_object =true;
            this.maps[startPos.data.x_index][startPos.data.y_index].movable =false;
        }
    }
}

// display all the sprites in the right layer
Map.prototype.renderMap = function (){

    this.floors.sort('y', Phaser.Group.SORT_ASCENDING);

    for (var x = 0; x <= this.game.world.width/this.floor_tile_size_width ; x++){
        for (var y = 0; y <= this.game.world.height/this.floor_tile_size_height ; y++){
            if (this.maps[x][y].empty != true){
                // add a movable tile
                fl = this.floors.create(this.maps[x][y].x, this.maps[x][y].y , this.maps[x][y].image);
                fl.data = {
                    x_index : x,
                    y_index : y
                }
            }
        }
    }


}
Map.prototype.makeMap = function() {
    for (var r=0; r<this.max_rooms; r++) {
        // create a random size room
        var w = this.game.rnd.integerInRange(this.room_min_size, this.room_max_size) * this.floor_tile_size_width;
        var h = this.game.rnd.integerInRange(this.room_min_size, this.room_max_size) * this.floor_tile_size_height;

        // find a position in the world to set the room
        x = this.game.rnd.integerInRange(1, ((this.game.world.width ) / this.floor_tile_size_width) - (w/this.floor_tile_size_width + 1)) * this.floor_tile_size_width;
        y = this.game.rnd.integerInRange(1, ((this.game.world.height) / this.floor_tile_size_height) - (h/this.floor_tile_size_height + 1)) * this.floor_tile_size_height;

        this.createRoom(x, x+w, y, y+h);

        if (this.num_rooms == 0) {
        // use these coordinates to assgin new player                
           this.player_x = x ;
           this.player_y = y ;
        } else {
            var new_x = this.game.math.snapToFloor(x + (w/2), this.floor_tile_size_width);
            var new_y = this.game.math.snapToFloor(y + (h/2), this.floor_tile_size_height);

            var prev_x = this.game.math.snapToFloor(this.lastRoomCoords.x, this.floor_tile_size_width);
            var prev_y = this.game.math.snapToFloor(this.lastRoomCoords.y, this.floor_tile_size_height);

            

            this.createHTunnel(prev_x, new_x, prev_y);
            this.createVTunnel(prev_y, new_y, new_x);
            // use the last room coordinates for destination TODO need a better method
            this.destination_x = x;
            this.destination_y = y;
        }

        this.lastRoomCoords = { x: x + (w/2), y: y + (h/2) };
        this.num_rooms++;

    }
}
