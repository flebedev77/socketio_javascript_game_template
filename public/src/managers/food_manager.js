import globals from "../core/globals.js";

export default function food_manager() {
    for(let i = globals.food_arr.length-1; i >= 0; i--) {
        const food_element = globals.food_arr[i];

        if (food_element.dead) globals.food_arr.splice(i, 1);

        //Looping backwards so have to get forward index
        food_element.index = (globals.food_arr.length-1) - i;
        food_element.update();
    }
}