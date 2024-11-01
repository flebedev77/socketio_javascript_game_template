import selector from "./selector.js";
import globals from "./globals.js";
import init from "./init.js";

import * as utils from "./utils.js";

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

        setTimeout(game_loop, globals.update_speed);
    }
}