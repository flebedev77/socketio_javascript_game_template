import globals from "../core/globals";
import { Vector2 } from "../core/utils";

export class Snake {
    position: Vector2;
    move_direction: Vector2;
    speed: number;
    constructor(x: number, y: number) {
        this.position = new Vector2(x, y);
        this.speed = globals.player_speed.normal;
        this.move_direction = new Vector2(0, 0);
    }

    update() {
        this.position.x += this.move_direction.x * this.speed * globals.delta_time;
        this.position.y += this.move_direction.y * this.speed * globals.delta_time;
    }

    sprint(sprinting: boolean) {
        this.speed = (sprinting) ? globals.player_speed.sprint : globals.player_speed.normal;
    }

    to_object() {
        return {
            position: this.position.to_object(),
            move_direction: this.move_direction.to_object(),
            speed: this.speed,
        }
    }
}