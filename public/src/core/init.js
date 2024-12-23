import selector from "../front_end/selector.js";
import globals from "./globals.js";
import apply_input_listeners from "./input.js";
import { Snake } from "../game_objects/snake.js";
import { Food } from "../game_objects/food.js";
import { Vector2 } from "../utils.js";
import { init_network } from "./networking.js";

//ran on page load
export default function init() {
    globals.socket = io();

    function resize_canvas() {
        selector.canvas.width = window.innerWidth;
        selector.canvas.height = window.innerHeight;
    }

    resize_canvas();
    window.onresize = function () {
        resize_canvas();
    }

    globals.local_player = new Snake(0, 0, 10);
    globals.local_player.is_local_player = true;
    globals.local_player.init();

    globals.gameloop_running = true;

    apply_input_listeners();
    init_network();
}