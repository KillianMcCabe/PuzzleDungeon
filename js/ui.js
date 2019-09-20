var ui;

function highlight() {
    this.tint = 0x888888;
}
function unhighlight() {
    this.tint = 0xffffff;
}

function drawCollisionBoxes() {
    if (DEBUG_COLLISIONS) {
        for (var i in objects) {
            var obj = objects[i];

            var rectangle = new Graphics();
            rectangle.lineStyle(1, 0xFF3300, 1);
            rectangle.drawRect(0, 0, obj.width, obj.height);
            rectangle.endFill();
            obj.addChild(rectangle);    
        }

        // player hitbox
        var rectangle = new Graphics();
            rectangle.lineStyle(1, 0x33FF00, 1);
            rectangle.drawRect(0, 0, player.width, player.height);
            rectangle.endFill();
            player.addChild(rectangle);
    }
}

function setupControls() {

    ui = new Container();
    stage.addChild(ui);

    //Capture the keyboard arrow keys
    var left = keyboard(37),
        up = keyboard(38),
        right = keyboard(39),
        down = keyboard(40);

    var r_key = keyboard(82);

    r_key.release = function() {
        restartLevel();
    };

    //Up
    up.press = function() {
        tryMove ({'x':0, 'y':-1});
        $("#up").addClass('active');
    };
    up.release = function() {
        $("#up").removeClass('active');
    };
    //Down
    down.press = function() {
        tryMove ({'x':0, 'y':1});
        $("#down").addClass('active');
    };
    down.release = function() {
        $("#down").removeClass('active');
    };
    //Left
    left.press = function() {
        tryMove ({'x':-1, 'y':0});
        $("#left").addClass('active');
    };
    left.release = function() {
        $("#left").removeClass('active');
    };
    //Right
    right.press = function() {
        tryMove ({'x':1, 'y':0});
        $("#right").addClass('active');
    };
    right.release = function() {
        $("#right").removeClass('active');
    };

    //addPlayerUIArrows();

    // html buttons
    $( "#up" ).click(function() {
        tryMove ({'x':0, 'y':-1});
    });
    $( "#down" ).click(function() {
        tryMove ({'x':0, 'y':1});
    });
    $( "#left" ).click(function() {
        tryMove ({'x':-1, 'y':0});
    });
    $( "#right" ).click(function() {
        tryMove ({'x':1, 'y':0});
    });
}

//TODO: does this get used?
function addPlayerUIArrows() {
    ui.position.set(renderer.width - (2* BLOCK_SIZE), renderer.height - (2* BLOCK_SIZE));

    //Arrows
    arrow_up = new Sprite(resources["textures/arrow.png"].texture); 
    arrow_up.position.set(0  + BLOCK_SIZE/2, -BLOCK_SIZE + BLOCK_SIZE/2);
    arrow_up.anchor.set(0.5);
    arrow_up.rotation = 0;
    arrow_up.interactive = true;
    arrow_up.buttonMode = true;
    arrow_up.mousedown = function(mouseData){
       tryMove ({'x':0, 'y':-1});
    }
    arrow_up.mouseover = highlight;
    arrow_up.mouseout = unhighlight;
    ui.addChild(arrow_up);

    arrow_down = new Sprite(resources["textures/arrow.png"].texture); 
    arrow_down.position.set(0  + BLOCK_SIZE/2, BLOCK_SIZE + BLOCK_SIZE/2);
    arrow_down.anchor.set(0.5);
    arrow_down.rotation = Math.PI;
    arrow_down.interactive = true;
    arrow_down.buttonMode = true;
    arrow_down.mousedown = function() {
        tryMove ({'x':0, 'y':1});
    }
    arrow_down.mouseover = highlight;
    arrow_down.mouseout = unhighlight;
    ui.addChild(arrow_down);

    arrow_left = new Sprite(resources["textures/arrow.png"].texture); 
    arrow_left.position.set(-BLOCK_SIZE + BLOCK_SIZE/2, 0  + BLOCK_SIZE/2);
    arrow_left.anchor.set(0.5);
    arrow_left.rotation = -0.5 * Math.PI;
    arrow_left.interactive = true;
    arrow_left.buttonMode = true;
    arrow_left.mousedown = function(mouseData){
       tryMove ({'x':-1, 'y':0});
    }
    arrow_left.mouseover = highlight;
    arrow_left.mouseout = unhighlight;
    ui.addChild(arrow_left);

    arrow_right = new Sprite(resources["textures/arrow.png"].texture); 
    arrow_right.position.set(BLOCK_SIZE + BLOCK_SIZE/2, 0  + BLOCK_SIZE/2);
    arrow_right.anchor.set(0.5);
    arrow_right.rotation = 0.5 * Math.PI;
    arrow_right.interactive = true;
    arrow_right.buttonMode = true;
    arrow_right.mousedown = function(mouseData){
       tryMove ({'x':1, 'y':0});
    }
    arrow_right.mouseover = highlight;
    arrow_right.mouseout = unhighlight;
    ui.addChild(arrow_right);
}

//The `keyboard` helper function
function keyboard(keyCode) {
    var key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = function(event) {
        if (event.keyCode === key.code) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
        }
        event.preventDefault();
    };
    //The `upHandler`
    key.upHandler = function(event) {
        if (event.keyCode === key.code) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
        }
        event.preventDefault();
    };
    //Attach event listeners
    window.addEventListener(
        "keydown", key.downHandler.bind(key), false
    );
    window.addEventListener(
        "keyup", key.upHandler.bind(key), false
    );
    return key;
}