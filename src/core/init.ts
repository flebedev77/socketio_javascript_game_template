import { Food } from "../game_objects/food";
import globals from "./globals";
import { Vector2 } from "./utils";

export default function init() {
    for (let i = 0; i < globals.food_amount; i ++) {
        globals.food_list.push(new Food(
            new Vector2(globals.map_size.width * Math.random(), globals.map_size.height * Math.random()),
            globals.food_radius,
        ));
    }
}