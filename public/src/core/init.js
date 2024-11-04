import selector from "../front_end/selector.js";
import globals from "./globals.js";
import apply_input_listeners from "./input.js";
import { Snake } from "../game_objects/snake.js";
import { Food } from "../game_objects/food.js";
import { Vector2 } from "../utils.js";

//ran on page load
export default function init() {
    function resize_canvas() {
        selector.canvas.width = window.innerWidth;
        selector.canvas.height = window.innerHeight;
    }

    resize_canvas();
    window.onresize = function () {
        resize_canvas();
    }

    globals.local_player = new Snake(window.innerWidth/2, window.innerHeight/2, 10, 20, 10);    
    globals.local_player.is_local_player = true;

    apply_input_listeners();
    

    for(let i = 0; i < 30; i++) {
        globals.food_arr.push(new Food(Math.random() * window.innerWidth, Math.random() * window.innerHeight));
    }
}