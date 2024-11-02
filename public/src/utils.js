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

export class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static distance(a, b) {
        // if (!!vector || !!vector.x || !!vector.y) return null;

        const dx = a.x - b.x;
        const dy = a.y - b.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    static normalized(v) {
        const x = -v.x;
        const y = -v.y;
        const m = Math.sqrt(x * x + y * y);
        return new Vector2(x / m, y / m);
    }

    static sub(a, b) {
        return new Vector2(
            a.x - b.x,
            a.y - b.y
        );
    }
}