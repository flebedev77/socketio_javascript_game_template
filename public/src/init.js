import selector from "./selector.js";
import globals from "./globals.js";
import { Snake } from "./game_objects/snake.js";
import { Food } from "./game_objects/food.js";

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

    window.onmousemove = function(e) {
        globals.local_player.position.x = e.x;
        globals.local_player.position.y = e.y;
    }

    for(let i = 0; i < 10; i++) {
        globals.food_arr.push(new Food(Math.random() * window.innerWidth, Math.random() * window.innerHeight, 10));
    }
}