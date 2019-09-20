var TYLE = {
    WALL : {value: 0, name: "Wall", code: "#", hasCollision: true}, 
    GROUND : {value: 1, name: "Ground", code: " ", hasCollision: false},
    PLAYER : {value: 2, name: "Player", code: "P", hasCollision: true},
    DOOR : {value: 3, name: "Door", code: "D", hasCollision: true},
    ROCK : {value: 4, name: "Rock", code: "R", hasCollision: true},
    SLIDEROCK : {value: 5, name: "Sliderock", code: "S", hasCollision: true},
    SPIKES : {value: 6, name: "Spikes", code: "^", hasCollision: false},
    PRESSURE_PLATE : {value: 7, name: "Pressure plate", code: "_", hasCollision: false},
    NOTE : {value: 8, name: "Note", code: "n", hasCollision: false},
    PORTAL : {value: 9, name: "Portal", code: "p", hasCollision: false},
};

var map = null;

var maps = [
    {
        dungeon_data: [
            '#####D#',
            '#P R  #',
            '#     #',
            '#######'],
        notes: [{
            location: {x:2, y:2},
            text: "Welcome to puzzle dungeon!"
        }],
        portals: []
    },

    {
        dungeon_data: [
            '#######',
            '#PR   #',
            '#   R #',
            '#####D#'],
        notes: [],
        portals: []
    },

    {
        dungeon_data: [
            '#######',
            '#P R  D',
            '#  S  #',
            '#######'],
        notes: [],
        portals: []
    },

    {
        dungeon_data: [
            '#####D#',
            '#P S  #',
            '#  S  #',
            '#######'],
        notes: [
            {
                location: {x:4, y:2},
                text: "If you make a mistake and need to try again, click the 'restart level' button on the right."
            }
        ],
        portals: []
    },

    {
        dungeon_data: [
            '#####D##',
            '#P RR  #',
            '#  S  R#',
            '#   SS #',
            '# ^    #',
            '########'],
        notes: [],
        portals: []
    },

    {
        dungeon_data: [
            '########',
            '#P     #',
            '# S  R #',
            '#RR    #',
            '#   R  #',
            '######D#'],
        notes: [],
        portals: [],
        pressure_plates: [
            { x:3, y:4, controlled_objects: [
                {type:TYLE.SPIKES, x:5, y:4},
                {type:TYLE.SPIKES, x:6, y:4}
            ]}
        ]
    },

    {
        dungeon_data: [
            '########',
            '#P R_  #',
            '#    RR#',
            '# S    #',
            '#    S #',
            'D      #',
            '########'],
        notes: [],
        portals: [],
        pressure_plates: [
            { x:4, y:1, controlled_objects: [
                {type:TYLE.SPIKES, x:1, y:4},
                {type:TYLE.SPIKES, x:1, y:5},
                {type:TYLE.SPIKES, x:2, y:5}
            ]}
        ]
    },

    {
        dungeon_data: [
            '########',
            '#P     #',
            '# S  R #',
            '#   S  #',
            '#      #',
            '#R  R  #',
            '#  S   D',
            '########'],
        notes: [],
        portals: [],
        pressure_plates: [
            { x:2, y:4, controlled_objects: [
                {type:TYLE.SPIKES, x:6, y:6}
            ]}
        ]
    },

    {
        dungeon_data: [
            '########',
            '#P     #',
            '#      #',
            '#^^^^^^#',
            '#  ^   #',
            '# S^  R#',
            'D  ^   #',
            '########'],
        notes: [],
        portals: [
            {x:2, y:2, teleports_to:{x:2, y:4}},
            {x:2, y:4, teleports_to:{x:2, y:2}},
            {x:4, y:2, teleports_to:{x:4, y:4}},
            {x:4, y:4, teleports_to:{x:4, y:2}}
        ],
        pressure_plates: [
            { x:5, y:1, controlled_objects: [
                {type:TYLE.SPIKES, x:1, y:6}
            ]}
        ]
    },

    {
        dungeon_data: [
            '########',
            '#P     #',
            '#      #',
            '#      #',
            '#      #',
            '#      #',
            'D      #',
            '########'],
        notes: [
            {
                location: {x:5, y:1},
                text: "Right, Down, Down, Down, Left, Left, Up, Down, Right, Down, Down, Left"
            }
        ],
        portals: [
            {x:1, y:2, teleports_to:{x:3, y:1}},
            {x:1, y:3, teleports_to:{x:3, y:1}}, // ..to here
            {x:1, y:4, teleports_to:null},
            {x:1, y:5, teleports_to:{x:3, y:1}},
            {x:1, y:6, teleports_to:null},

            {x:2, y:2, teleports_to:{x:3, y:1}},
            {x:2, y:3, teleports_to:{x:3, y:1}},
            {x:2, y:4, teleports_to:null},
            {x:2, y:5, teleports_to:null},
            {x:2, y:6, teleports_to:null},

            {x:3, y:2, teleports_to:{x:3, y:1}},
            {x:3, y:3, teleports_to:null},
            {x:3, y:4, teleports_to:{x:3, y:1}},
            {x:3, y:5, teleports_to:{x:3, y:1}},
            {x:3, y:6, teleports_to:{x:3, y:1}},

            {x:4, y:2, teleports_to:{x:3, y:1}},
            {x:4, y:3, teleports_to:{x:1, y:3}}, // this one brings..
            {x:4, y:4, teleports_to:null},
            {x:4, y:5, teleports_to:{x:3, y:1}},
            {x:4, y:6, teleports_to:{x:3, y:1}},

            {x:5, y:2, teleports_to:{x:3, y:1}},
            {x:5, y:3, teleports_to:{x:3, y:1}},
            {x:5, y:4, teleports_to:null},
            {x:5, y:5, teleports_to:{x:3, y:1}},
            {x:5, y:6, teleports_to:{x:3, y:1}},

            {x:6, y:2, teleports_to:null},
            {x:6, y:3, teleports_to:null},
            {x:6, y:4, teleports_to:null},
            {x:6, y:5, teleports_to:{x:3, y:1}},
            {x:6, y:6, teleports_to:{x:3, y:1}},
        ]
    },

    // {
    //     dungeon_data: [
    //         '#######',
    //         '#P    D',
    //         '#######'],
    //     player_loc: {x: 1, y: 1},
    //     bounds: {x: 1, y: 1, width: 5, height: 2},
    //     notes: [
    //         {
    //             location: {x:1, y:2},
    //             text: "You're doing a good job. You're halfway there!"
    //         }
    //     ]
    // },

    {
        dungeon_data: [
            '####################',
            '#P       ##    R   #',
            '#   S    ^^        #',
            '#  S     ##        #',
            '#                  #',
            '#              R   #',
            '#   R    ##        #',
            'D        ^^        #',
            '#  R     ##   R    #',
            '####################'],
        notes: [],
        portals: [],
        pressure_plates: [
            { x:4, y:7, controlled_objects: [
                {type:TYLE.SPIKES, x:1, y:7}
            ]}
        ]
    },

    {
        dungeon_data: [
            '####################',
            '#P                 D',
            '# #^^^^^^^^^^^^^^^^#',
            '# #R    R    R  R  #',
            '# #                #',
            '# #   #   ##   #   #',
            '#                  #',
            '# #SSS#SSS##SSS#SSS#',
            '#                  #',
            '####################'],
        notes: [],
        portals: [
            
        ],
        //if object is on this panel, if will deactivate any controlled objects
        pressure_plates: [
            { x:3, y:4, controlled_objects: [{type:TYLE.SPIKES, x:3, y:1}] },
            { x:4, y:4, controlled_objects: [] },
            { x:5, y:4, controlled_objects: [] },

            { x:7, y:4, controlled_objects: [] },
            { x:8, y:4, controlled_objects: [{type:TYLE.SPIKES, x:8, y:1}] },
            { x:9, y:4, controlled_objects: [] },

            { x:12, y:4, controlled_objects: [] },
            { x:13, y:4, controlled_objects: [{type:TYLE.SPIKES, x:13, y:1}] },
            { x:14, y:4, controlled_objects: [] },

            { x:16, y:4, controlled_objects: [{type:TYLE.SPIKES, x:16, y:1}] },
            { x:17, y:4, controlled_objects: [] },
            { x:18, y:4, controlled_objects: [] }
        ]
    },

    {
        dungeon_data: [
            '##########',
            '#P #     #',
            '# S   #  #',
            '## # ##  #',
            '#   S #  #',
            '# ##  #  #',
            '# # S  # #',
            '# #   S  #',
            '#    # # D',
            '##########'],
        notes: [],
        portals: [],
        pressure_plates: [
            { x:4, y:1, controlled_objects: [{type:TYLE.SPIKES, x:8, y:8}] },
            { x:1, y:8, controlled_objects: [{type:TYLE.SPIKES, x:6, y:6}] },
            { x:3, y:7, controlled_objects: [{type:TYLE.SPIKES, x:4, y:5}] }
        ]
    },
    {
        dungeon_data: [
            '##########',
            '#P #     #',
            '# S   #  #',
            '## # ##  #',
            '#   S #  #',
            '# ## ##  #',
            '# # S  # #',
            '# #  #   #',
            '#   ^S # D',
            '##########'],
        notes: [],
        portals: [],
        pressure_plates: [
            { x:4, y:1, controlled_objects: [{type:TYLE.SPIKES, x:8, y:8}] },
            { x:1, y:8, controlled_objects: [{type:TYLE.SPIKES, x:4, y:5}] }
        ]
    },

    // {
    //     dungeon_data: [
    //         '######.######.######',
    //         '#P   ###    ###  R #',
    //         '#_   ^^^           #',
    //         '###############^^^ #',
    //         '..# #.........#    .',
    //         '### #####..####   ##',
    //         '#      R####       #',
    //         '#          ^      R#',
    //         '#          ^       #',
    //         '### #^^^#..#########',
    //         '..# #   #...........',
    //         '..#     #...........',
    //         '### #^^ #######.....',
    //         '#     R    S  #.....',
    //         '#   R      S  #.....',
    //         '####   #####  #.....',
    //         '...#   #...#  #.....',
    //         '####   #####  #.####',
    //         '#             #.#  #',
    //         '#             #.# ^D',
    //         '############### ####'],
    //     player_loc: {x: 1, y: 1},
    //     bounds: {x: 1, y: 1, width: 8, height: 8},
    //     notes: [],
    //     portals: [
    //         {x:4, y:1, teleports_to:{x:8, y:1}},
    //         {x:8, y:1, teleports_to:{x:4, y:1}},

    //         {x:4, y:2, teleports_to:{x:17, y:18}},
    //         {x:17, y:18, teleports_to:{x:4, y:2}},
    //     ]
    // },

    {
        dungeon_data: [
            '####################',
            '#P                 #',
            '# R   R RRRRR R   R#',
            '# R   R R   R R   R#',
            '#  R R  R   R R   R#',
            '#   R   R   R R   R#',
            '#   R   RRRRR RRRRR#',
            '#                  #',
            '#########  #########',
            '........#  #........',
            '........#  #........',
            '#########  #########',
            '#                  #',
            '# R   R RRRRR R   R#',
            '# R   R   R   RR  R#',
            '# R R R   R   R R R#',
            '# R R R   R   R  RR#',
            '#  R R  RRRRR R   R#',
            '#                  D',
            '####################'],
        notes: [],
        portals: []
    },
]

function charAt (map_data, x, y) {
    if (x >= 0 && y >=0  && y < map_data.length && x < map_data[y].length) {
        return map_data[y][x];
    }
    return null;
}

function destroyDungeon() {
    for (var i = gameScene.children.length - 1; i >= 0; i--) {
        gameScene.removeChild(gameScene.children[i]);
    };
}

function buildDungeon(level) {
    // delete prvious dungeon
    destroyDungeon();

    map = maps[level];
    objects = [];

    var spikes, pressure_plate;
    // build dugeon tiles
    for (var y = 0, ylen = map.dungeon_data.length; y < ylen; y++) {
        for (var x = 0, xlen = map.dungeon_data[y].length; x < xlen; x++) {
            var char = map.dungeon_data[y][x];

            switch (char) {
                case TYLE.WALL.code:

                    if (charAt(map.dungeon_data, x, y+1) != TYLE.WALL.code) {
                        wall = new Sprite(spritesheet["wall2.png"]);
                        wall.position.set(x * BLOCK_SIZE, y * BLOCK_SIZE);
                        wall.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
                        gameScene.addChild(wall);

                        // incase of top edge mixing with wall block
                        if (charAt(map.dungeon_data, x, y-1) == TYLE.WALL.code) {
                            // retyle to remove blue higlight 
                            wall = new Sprite(spritesheet["wall-cap.png"]);
                            wall.position.set(x * BLOCK_SIZE, y * BLOCK_SIZE);
                            wall.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
                            gameScene.addChild(wall);
                        }
                    } else {
                        wall = new Sprite(spritesheet["wall.png"]);
                        wall.position.set(x * BLOCK_SIZE, y * BLOCK_SIZE);
                        wall.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
                        gameScene.addChild(wall);

                        // incase of top edge not mixing with wall block
                        if (charAt(map.dungeon_data, x, y-1) != TYLE.WALL.code) {
                            // retyle to add blue higlight 
                            wall = new Sprite(spritesheet["wall2-cap.png"]);
                            wall.position.set(x * BLOCK_SIZE, y * BLOCK_SIZE);
                            wall.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
                            gameScene.addChild(wall);
                        }
                    }

                    wall.type = TYLE.WALL;
                    objects.push(wall);
                    
                    break;
                case TYLE.GROUND.code:
                    ground = new Sprite(spritesheet["ground.png"]);
                    ground.position.set(x * BLOCK_SIZE, y * BLOCK_SIZE);
                    ground.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

                    gameScene.addChild(ground);
                    break;
                case TYLE.DOOR.code:
                    door = new Sprite(spritesheet["door.png"]); 
                    door.position.set(x * BLOCK_SIZE, y * BLOCK_SIZE);
                    door.type = TYLE.DOOR;
                    objects.push(door);
                    break;

                //
                // The following objects have ground underneath
                //
                case TYLE.PLAYER.code:
                    // place ground under player
                    ground = new Sprite(spritesheet["ground.png"]);
                    ground.position.set(x * BLOCK_SIZE, y * BLOCK_SIZE);
                    gameScene.addChild(ground);

                    player = new Sprite(resources["textures/explorer.png"].texture); 
                    player.position.set(x * BLOCK_SIZE, y * BLOCK_SIZE);
                    player.type = TYLE.PLAYER;
                    player.zOrder = 1;
                    objects.push(player);

                    break;
                case TYLE.ROCK.code:
                    rock = new Sprite(resources["textures/rock.png"].texture); 
                    rock.position.set(x * BLOCK_SIZE, y * BLOCK_SIZE);
                    rock.type = TYLE.ROCK;
                    rock.zOrder = 5;
                    objects.push(rock);

                    // place ground under rock
                    ground = new Sprite(spritesheet["ground.png"]);
                    ground.position.set(x * BLOCK_SIZE, y * BLOCK_SIZE);
                    gameScene.addChild(ground);

                    break;
                case TYLE.SLIDEROCK.code:
                    sliderock = new Sprite(resources["textures/sliderock.png"].texture); 
                    sliderock.position.set(x * BLOCK_SIZE, y * BLOCK_SIZE);
                    sliderock.type = TYLE.SLIDEROCK;
                    sliderock.slide = {x:0, y:0};
                    sliderock.zOrder = 5;
                    objects.push(sliderock);

                    // place ground under rock
                    ground = new Sprite(spritesheet["ground.png"]);
                    ground.position.set(x * BLOCK_SIZE, y * BLOCK_SIZE);
                    gameScene.addChild(ground);
                    break;

                case TYLE.SPIKES.code:
                    spikes = new Sprite(spritesheet["spikes.png"]); 
                    spikes.position.set(x * BLOCK_SIZE, y * BLOCK_SIZE);
                    spikes.type = TYLE.SPIKES;
                    spikes.slide = {x:0, y:0};
                    spikes.zOrder = 5;
                    spikes.active = true;
                    objects.push(spikes);

                    // place ground under rock
                    ground = new Sprite(spritesheet["ground.png"]);
                    ground.position.set(x * BLOCK_SIZE, y * BLOCK_SIZE);
                    gameScene.addChild(ground);
                    break;

                case TYLE.PRESSURE_PLATE.code:
                    pressure_plate = new Sprite(spritesheet["pressure_plate.png"]); 
                    pressure_plate.position.set(x * BLOCK_SIZE, y * BLOCK_SIZE);
                    pressure_plate.type = TYLE.PRESSURE_PLATE;
                    pressure_plate.zOrder = 10;
                    objects.push(pressure_plate);

                    // place ground under rock
                    ground = new Sprite(spritesheet["ground.png"]);
                    ground.position.set(x * BLOCK_SIZE, y * BLOCK_SIZE);
                    gameScene.addChild(ground);
                    break;
            }
        }
    }

    // add extra objects e.g. pickups, notes etc
    for (var i in map.notes) {
        var note = map.notes[i];

        object = new Sprite(spritesheet["note.png"]); 
        object.position.set(note.location.x * BLOCK_SIZE, note.location.y * BLOCK_SIZE);
        object.type = TYLE.NOTE;
        object.zOrder = 10;
        object.note = note;
        objects.push(object);
    }
    // add extra objects e.g. pickups, notes etc
    for (var i in map.portals) {
        var portal = map.portals[i];

        object = new Sprite(spritesheet["portal.png"]); 
        object.position.set(portal.x * BLOCK_SIZE, portal.y * BLOCK_SIZE);
        object.type = TYLE.PORTAL;
        object.zOrder = 10;
        object.portal = portal;
        objects.push(object);
    }

    if (typeof map.pressure_plates != 'undefined') {
        for (var i in map.pressure_plates) {
            var plate = map.pressure_plates[i];

            object = new Sprite(spritesheet["pressure_plate.png"]); 
            object.position.set(plate.x * BLOCK_SIZE, plate.y * BLOCK_SIZE);
            object.type = TYLE.PRESSURE_PLATE;
            object.controlled_objects = [];
            for (var j in plate.controlled_objects) {
                
                var controlled_object = plate.controlled_objects[j];
                var x = controlled_object.x;
                var y = controlled_object.y;
                if (controlled_object.type.value == TYLE.SPIKES.value) {
                    controlled_object = new Sprite(spritesheet["spikes.png"]); 
                    controlled_object.type = TYLE.SPIKES;
                }
                
                controlled_object.position.set(x * BLOCK_SIZE, y * BLOCK_SIZE);

                object.controlled_objects.push(controlled_object);
                objects.push(controlled_object);
            }
            
            object.zOrder = 10;
            object.portal = portal;
            objects.push(object);
        }
    }

    // sort objects by zOrder
    objects.sort(function(a,b) {
        a.zOrder = a.zOrder || 0;
        b.zOrder = b.zOrder || 0;
        return b.zOrder - a.zOrder
    });
    // draw objects over tiles
    for (var j in objects) {
        gameScene.addChild(objects[j]);
    }

    drawCollisionBoxes();

    // position scene in center of renderer
    var width = map.dungeon_data[0].length;
    if (width > 10) width = 10;
    var height = map.dungeon_data.length;
    if (height > 10) height = 10;

    gameScene.x = renderer.width / 2 - ((width*gamescale/2)*BLOCK_SIZE);
    gameScene.y = renderer.height / 2 - ((height*gamescale/2)*BLOCK_SIZE);

    // display level in ui
    $('#level').html((level+1)+' / '+maps.length);
    

    //gameScene.updateLayersOrder();
}
