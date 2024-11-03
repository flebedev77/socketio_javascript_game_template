import globals from "../core/globals.js";
import { Vector2, pick_random_from_array } from "../utils.js";

export class Food {
    constructor(x, y, r) {
        this.position = new Vector2(x, y);
        this.radius = r;
        this.color = pick_random_from_array(globals.food_colors);

        this.ctx = globals.canvas_context;
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.closePath();
    }

    update() {
        this.draw();
    }
}