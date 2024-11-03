import globals from "./globals.js";

export default function apply_input_listeners() {
    window.addEventListener("keydown", function (e) {
        switch (e.key.toUpperCase()) {
            case "ARROWUP":
                globals.keys.up = true;
                any_input(globals.input_actions.type.KEYBOARD);
                break;
            case "ARROWDOWN":
                globals.keys.down = true;
                any_input(globals.input_actions.type.KEYBOARD);
                break;
            case "ARROWLEFT":
                globals.keys.left = true;
                any_input(globals.input_actions.type.KEYBOARD);
                break;
            case "ARROWRIGHT":
                globals.keys.right = true;
                any_input(globals.input_actions.type.KEYBOARD);
                break;
            case "W":
                globals.keys.up = true;
                any_input(globals.input_actions.type.KEYBOARD);
                break;
            case "A":
                globals.keys.left = true;
                any_input(globals.input_actions.type.KEYBOARD);
                break;
            case "S":
                globals.keys.down = true;
                any_input(globals.input_actions.type.KEYBOARD);
                break;
            case "D":
                globals.keys.right = true;
                any_input(globals.input_actions.type.KEYBOARD);
                break;
        }
    })

    window.addEventListener("keyup", function (e) {
        switch (e.key.toUpperCase()) {
            case "ARROWUP":
                globals.keys.up = false;
                any_input(globals.input_actions.type.KEYBOARD);
                break;
            case "ARROWDOWN":
                globals.keys.down = false;
                any_input(globals.input_actions.type.KEYBOARD);
                break;
            case "ARROWLEFT":
                globals.keys.left = false;
                any_input(globals.input_actions.type.KEYBOARD);
                break;
            case "ARROWRIGHT":
                globals.keys.right = false;
                any_input(globals.input_actions.type.KEYBOARD);
                break;
            case "W":
                globals.keys.up = false;
                any_input(globals.input_actions.type.KEYBOARD);
                break;
            case "A":
                globals.keys.left = false;
                any_input(globals.input_actions.type.KEYBOARD);
                break;
            case "S":
                globals.keys.down = false;
                any_input(globals.input_actions.type.KEYBOARD);
                break;
            case "D":
                globals.keys.right = false;
                any_input(globals.input_actions.type.KEYBOARD);
                break;
        }
    })


    window.addEventListener("mousemove", (e) => {
        globals.mouse.position.x = e.x;
        globals.mouse.position.y = e.y;
        any_input(globals.input_actions.type.MOUSE);
    })

    window.addEventListener("mousedown", () => {
        globals.mouse.left.down = true;
        any_input(globals.input_actions.type.MOUSE);
    })
    window.addEventListener("mouseup", () => {
        globals.mouse.left.down = false;
        any_input(globals.input_actions.type.MOUSE);
    })

    function any_input(input_type) {
        if (input_type == globals.input_actions.type.KEYBOARD) 
            globals.keys.last_input_time = Date.now();
        else if (input_type == globals.input_actions.type.MOUSE)
            globals.mouse.last_input_time = Date.now();
        
        globals.input_actions.sprint = (globals.keys.space || globals.mouse.left.down);
    }
}