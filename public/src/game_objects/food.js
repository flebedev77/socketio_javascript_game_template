import globals from "../core/globals.js";
import { Vector2 } from "../utils.js";

export class Food {
    constructor(x, y, r) {
        this.position = new Vector2(x, y);
        this.radius = r;
        this.color = globals.food_colors[Math.floor(Math.random() * globals.food_colors.length)];

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