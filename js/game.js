//Aliases
var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    TextureCache = PIXI.utils.TextureCache,
    Texture = PIXI.Texture,
    Sprite = PIXI.Sprite,
    Text = PIXI.Text,
    Graphics = PIXI.Graphics;

//Create a Pixi stage and renderer and add the 
//renderer.view to the DOM
var game_div = document.getElementById("game_canvas");
var stage = new Container(),
    renderer = autoDetectRenderer(512, 512);

game_div.appendChild(renderer.view);

loader
    .add("textures/spritesheet.json")
    .add("textures/arrow.png")
    .add("textures/rock.png")
    .add("textures/sliderock.png")
    .add("textures/explorer.png")
    .load(setup);

//Define variables that might be used in more 
//than one function
var state, player, treasure, blobs, chimes, exit, dungeon,
    door, message, gameScene, gameOverScene, noteView, enemies, id, wall, ground, note_message;
var objects = [];

var level = 0; // 0 is first level

var DEBUG_COLLISIONS = false;
var BLOCK_SIZE = 32;
var map_bounds;
var gamescale = 1.5;

function setup() {
    //Make the game scene and add it to the stage
    gameScene = new Container();
    gameScene.enableSort = true;

    stage.addChild(gameScene);

    //Make the sprites and add them to the `gameScene`
    //Create an alias for the texture atlas frame ids
    spritesheet = resources["textures/spritesheet.json"].textures;

    buildDungeon(level);

    gameScene.addChild(player);
    gameScene.scale.set(gamescale, gamescale);

    //Create the `gameOver` scene
    gameOverScene = new Container();
    stage.addChild(gameOverScene);
    //Make the `gameOver` scene invisible when the game first starts
    gameOverScene.visible = false;
    //Create the text sprite and add it to the `gameOver` scene
    message = new Text(
        "Watch out for the spikes!",
        { font: "64px Futura", fill: "white" }
    );
    message.x = 120;
    message.y = stage.height / 2 - 32;
    gameOverScene.addChild(message);


    //Create the `note` view
    noteView = new Container();
    stage.addChild(noteView);
    //Make the `gameOver` scene invisible when the game first starts
    noteView.visible = false;
    //Create the text sprite and add it to the `gameOver` scene
    note_message = new Text(
        "<note text goes here>",
        { font: "64px Futura", fill: "white" }
    );
    note_message.x = 120;
    note_message.y = stage.height / 2 - 32;
    noteView.addChild(note_message);

    setupControls();

    //Set the game state
    state = play;

    //Start the game loop
    gameLoop();
}

function gameLoop() {
    //Loop this function 60 times per second
    requestAnimationFrame(gameLoop);
    //Update the current game state
    state();
    //Render the stage
    renderer.render(stage);
}

function play() {

    //contain(player, stage);
    //Set `playerHit` to `false` before checking for a collision
    var playerHit = false;

    //If the player is hit...
    if (playerHit) {
        //Make the player semi-transparent
        player.alpha = 0.5;
        state = end;
    } else {
        //Make the player fully opaque (non-transparent) if it hasn't been hit
        player.alpha = 1;
    }

    // TODO: implement this in move and slide
    // TODO: allow multiple plates
    // var pressure_plate_down = false; 
    for (var i in objects) {
        var obj = objects[i];
        if (typeof obj.slide != 'undefined') {
            if (obj.slide.x != 0 || obj.slide.y != 0) {
                slide(obj);
            }
        }

        if (obj.type.value == TYLE.PRESSURE_PLATE.value) {
            if (generalHitTest(obj, { x: 0, y: 0 })) {
                obj.active = true;
            } else {
                obj.active = false;
            }
            setActiveControlledObjects(obj, !obj.active);
        }
    }

    // if (!pressure_plate_down) {
    //     unhideSpikes();
    // }


    // adjust scene position as if camera is following player (didn't like this, felt motion sick)
    //gameScene.x = -player.x*gamescale + renderer.width / 2 - BLOCK_SIZE/2;
    //gameScene.y = -player.y*gamescale + renderer.height / 2 - BLOCK_SIZE/2;

}

function hideSpikes() {
    for (var i in objects) {
        var obj = objects[i];

        if (obj.type.value == TYLE.SPIKES.value) {
            obj.active = false;
            obj.alpha = 0;
        }
    }
}
function unhideSpikes() {
    for (var i in objects) {
        var obj = objects[i];

        if (obj.type.value == TYLE.SPIKES.value) {
            obj.active = true;
            obj.alpha = 1;
        }
    }
}

function end() {
    gameScene.visible = false;
    gameOverScene.visible = true;
}

function generalHitTest(obj, move) {
    // if (hitTestBoundary(obj, move)) {
    //     return true;
    // }

    for (var i in objects) {
        var test_obj = objects[i];

        if (test_obj != obj && test_obj.type.hasCollision && hitTestRectangle(obj, move, test_obj)) {
            return true;
        }
    }

    return false;
};

function hitTestRectangle(o1, move, r2) {
    //Define the variables we'll need to calculate
    var hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

    var r1 = {};
    r1.x = o1.x + move.x;
    r1.y = o1.y + move.y;
    r1.width = o1.width;
    r1.height = o1.height;

    //hit will determine whether there's a collision
    hit = false;
    //Find the center points of each sprite
    r1.centerX = r1.x + r1.width / 2;
    r1.centerY = r1.y + r1.height / 2;

    r2.centerX = r2.x + r2.width / 2;
    r2.centerY = r2.y + r2.height / 2;
    //Find the half-widths and half-heights of each sprite
    r1.halfWidth = r1.width / 2;
    r1.halfHeight = r1.height / 2;
    r2.halfWidth = r2.width / 2;
    r2.halfHeight = r2.height / 2;
    //Calculate the distance vector between the sprites
    vx = r1.centerX - r2.centerX;
    vy = r1.centerY - r2.centerY;
    //Figure out the combined half-widths and half-heights
    combinedHalfWidths = r1.halfWidth + r2.halfWidth;
    combinedHalfHeights = r1.halfHeight + r2.halfHeight;
    //Check for a collision on the x axis
    if (Math.abs(vx) < combinedHalfWidths) {
        //A collision might be occuring. Check for a collision on the y axis
        if (Math.abs(vy) < combinedHalfHeights) {
            //There's definitely a collision happening
            hit = true;
        } else {
            //There's no collision on the y axis
            hit = false;
        }
    } else {
        //There's no collision on the x axis
        hit = false;
    }
    //`hit` will be either `true` or `false`
    return hit;
};

// function hitTestBoundary(obj, movement) {
//     var x = obj.x + movement.x;
//     var y = obj.y + movement.y;

//     if ((x > map_bounds.x && x < map_bounds.width) && (y > map_bounds.y && y < map_bounds.height)) {
//         return false;
//     }

//     return true;
// };

//The `randomInt` helper function
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function tryAgain() {
    gameScene.visible = true;
    gameOverScene.visible = false;

    hideNote();
    buildDungeon(level);
}

function die() {

    gameScene.visible = false;
    gameOverScene.visible = true;

    setTimeout(tryAgain, 1000);
}

function hideNote() {

    for (var i = noteView.children.length - 1; i >= 0; i--) {
        noteView.removeChild(noteView.children[i]);
    };
}

function showNote(note) {

    // remove previous notes
    hideNote();

    // Text
    var str = note.text;
    var padding = { x: 10, y: 5 };
    var radius = 10;
    var origin = { x: 150, y: 200 };
    var tx = new PIXI.Text(str, { font: '20px Calibri', fontSize: 20, fill: 0x000000, align: 'left', wordWrap: true, wordWrapWidth: 300 });
    tx.position = { x: origin.x + padding.x, y: origin.y - padding.y };
    tx.anchor.set(0, 1);

    // backdrop
    var textbg = new PIXI.Graphics();
    textbg.beginFill(0xFFFFFF, 1);
    textbg.drawRoundedRect(origin.x, origin.y - (tx.height + 2 * padding.y), tx.width + 2 * padding.x, tx.height + 2 * padding.y, radius);
    textbg.endFill();

    // add new note
    //noteView.addChild(note_message);
    noteView.addChild(textbg);
    noteView.addChild(tx);

    noteView.visible = true;
}

function movePlayerTo(x, y) {
    // first reactivte any plates we were standing on
    player.x = x;
    player.y = y;

    // if player is offscreen then move the camera to next screen area
    if (map.dungeon_data[0].length >= 10) {
        var screen_x = Math.floor((player.x / BLOCK_SIZE) / 10);
        gameScene.x = -renderer.width * screen_x + (BLOCK_SIZE / 2) * ((screen_x * 2) + 1);
    }
    if (map.dungeon_data.length >= 10) {
        var screen_y = Math.floor((player.y / BLOCK_SIZE) / 10);
        gameScene.y = -renderer.height * screen_y + (BLOCK_SIZE / 2) * ((screen_y * 2) + 1);
    }
}

function setActiveControlledObjects(object, active) {
    for (var j in object.controlled_objects) {
        var controlled_object = object.controlled_objects[j];
        controlled_object.active = active;
        if (active) {
            controlled_object.alpha = 1;
        } else {
            controlled_object.alpha = 0;
        }
    }
}

function tryMove(movement) {
    hideNote();

    var mv = JSON.parse(JSON.stringify(movement));
    mv.x *= 4;
    mv.y *= 4;

    movement.x *= BLOCK_SIZE;
    movement.y *= BLOCK_SIZE;

    var collided = false;

    for (var i in objects) {
        var object = objects[i];
        if (!collided) {
            if (hitTestRectangle(player, movement, object)) {
                if (object.type.hasCollision) {
                    collided = true;
                }

                if (object.type.value === TYLE.DOOR.value) {
                    //state = next_level;
                    level += 1;

                    if (level < maps.length) {
                        buildDungeon(level);
                    } else {
                        state = end;
                        message.text = "You won!";
                    }
                } else if (object.type.value === TYLE.SLIDEROCK.value) {
                    object.slide = mv;
                } else if (object.type.value === TYLE.SPIKES.value && object.active) {
                    collided = true;
                    die();
                } else if (object.type.value === TYLE.NOTE.value) {
                    showNote(object.note);
                } else if (object.type.value === TYLE.PORTAL.value) {

                    if (object.portal.teleports_to != null) {
                        collided = true;
                        var x = object.portal.teleports_to.x * BLOCK_SIZE;
                        var y = object.portal.teleports_to.y * BLOCK_SIZE;
                        movePlayerTo(x, y);
                        return;
                    }
                } else if (object.type.value === TYLE.PRESSURE_PLATE.value) {
                    if (typeof object.controlled_objects != 'undefined') {
                        object.active = true;
                        setActiveControlledObjects(object, object.false);
                    }

                }

            }
        }
    }

    if (!collided) {
        var x = player.x + movement.x;
        var y = player.y + movement.y;
        movePlayerTo(x, y)
    }

}

function slide(obj) {

    if (generalHitTest(obj, obj.slide)) {
        obj.slide.x = obj.slide.y = 0;
    }
    // go on sliding..
    else {
        obj.x += obj.slide.x;
        obj.y += obj.slide.y;
    }

}


// window.onresize = function (event) {
//     var w = window.innerWidth;
//     var h = window.innerHeight;  
//     //    this part resizes the canvas but keeps ratio the same
//     renderer.view.style.width = w + "px";
//     renderer.view.style.height = h + "px";
//     //this part adjusts the ratio:
//     renderer.resize(w,h);
// }

window.onload = function () {
    $('#restart_level').click(tryAgain);
}
