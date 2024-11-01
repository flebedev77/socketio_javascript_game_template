import selector from "./selector.js";
import globals from "./globals.js";

export function calculate_time() {
    globals.previous_time = globals.current_time;
    globals.current_time = Date.now();
    globals.delta_time = globals.current_time - globals.previous_time;
    globals.fps = Math.ceil(1000 / globals.delta_time);

    globals.fps_display_delay += globals.delta_time;
    if (globals.fps_display_delay > globals.fps_display_rate) {
        globals.fps_display_delay = 0;
        selector.fps_counter.innerText = "FPS: " + globals.fps;
    }
}