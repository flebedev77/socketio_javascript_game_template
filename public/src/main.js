import selector from "./front_end/selector.js";
import globals from "./core/globals.js";
import init from "./core/init.js";

import * as utils from "./utils.js";


//managers
import food_manager from "./managers/food_manager.js";
import networking_manager from "./managers/networking_manager.js";

const ctx = globals.canvas_context;
const canvas = selector.canvas;

window.onload = function() {
    main();
}

function main() {
    init();
    game_loop();

    function game_loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        utils.calculate_time();

        
        food_manager();
        globals.local_player.update();
        networking_manager();

        setTimeout(game_loop, globals.update_speed);
    }
}