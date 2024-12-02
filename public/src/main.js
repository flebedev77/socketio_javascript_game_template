import selector from "./front_end/selector.js";
import globals from "./core/globals.js";
import init from "./core/init.js";

import * as utils from "./utils.js";


//managers
import food_manager from "./managers/food_manager.js";
import networking_manager from "./managers/networking_manager.js";
import dom_init from "./core/dom_init.js";

const ctx = globals.canvas_context;
const canvas = selector.canvas;

// window.onload = function() {
//     main();
// }

globals.start_callback = () => {
    if (selector.username_input.value.trim() != "") {
        // selector.start_dialog.style.display = "none";
        selector.connecting_screen.style.display = "grid";
        globals.username = selector.username_input.value;
        setTimeout(() => {
            main();
        }, 500)
    } else {
        selector.invalid_username_message.style.display = "block";
        setTimeout(() => {
            selector.invalid_username_message.style.display = "none";
        }, 1000)
    }
}

dom_init();

function main() {
    init();
    game_loop();

    function game_loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        utils.calculate_time();


        food_manager();
        globals.local_player.update();
        networking_manager();

        if (globals.gameloop_running) setTimeout(game_loop, globals.update_speed);
    }
}