import selector from "./front_end/selector.js";
import globals from "./core/globals.js";

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

export function pick_random_from_array(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

export class Rect2 {
    constructor(x, y, w, h) {
        this.position = new Vector2(x, y);
        this.width = w;
        this.height = h;
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
        if (m == 0) return new Vector2(0, 0);
        return new Vector2(x / m, y / m);
    }

    static sub(a, b) {
        return new Vector2(
            a.x - b.x,
            a.y - b.y
        );
    }

    static clone(vector) {
        return new Vector2(vector.x, vector.y);
    }

    static magnitude(vector) {
        const x = -vector.x;
        const y = -vector.y;
        return Math.sqrt(x * x + y * y);
    }

    static from_object(obj) {
        return new Vector2(obj.x, obj.y);
    }

    to_object() {
        return {
            x: this.x,
            y: this.y
        };
    }
}

export function start_timer() {
    globals.performance_timer.running = true;
    globals.performance_timer.start_time = Date.now();
}

export function stop_timer() {
    globals.performance_timer.running = false;
    globals.performance_timer.stop_time = Date.now();
    globals.performance_timer.time_passed = globals.performance_timer.stop_time - globals.performance_timer.start_time;
}

export function aabb_collision(a, b) {
    return (
        a.position.x + a.width > b.position.x &&
        a.position.x < b.position.x + b.width &&
        a.position.y + a.height > b.position.y &&
        a.position.y < b.position.y + b.height
    );
}

export function deep_copy(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj; // base case: primitive value or null
    }

    if (Array.isArray(obj)) {
        const arrCopy = [];
        for (let i = 0; i < obj.length; i++) {
            arrCopy[i] = deep_copy(obj[i]);
        }
        return arrCopy;
    }

    const objCopy = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            objCopy[key] = deep_copy(obj[key]);
        }
    }
    return objCopy;
}

export function deep_merge(target, source) {
    // Check if source is an object and target is also an object
    if (source !== null && typeof source === 'object' && target !== null && typeof target === 'object') {
        // Iterate through the keys of the source object
        for (let key in source) {
            if (source.hasOwnProperty(key)) {
                // If the property in the source is an object, we need to recurse
                if (typeof source[key] === 'object' && source[key] !== null) {
                    // If the target doesn't have this key or it's not an object, create an object
                    if (!target[key] || typeof target[key] !== 'object') {
                        target[key] = {};
                    }
                    // Recursively merge the properties
                    deep_merge(target[key], source[key]);
                } else {
                    // If the property is a primitive (not an object), directly assign it
                    target[key] = source[key];
                }
            }
        }
    }
    return target;
}

export function alert_popup(title, content, button = "Ok") {
    selector.alert.dialog.style.display = "flex";
    selector.alert.title.innerText = title,
        selector.alert.content.innerText = content;
    selector.alert.button.innerText = button;
}
