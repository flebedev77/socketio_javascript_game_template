import { Vector2 } from "../core/utils";

export class Snake {
    position: Vector2;
    move_direction: Vector2;
    constructor(x: number, y: number) {
        this.position = new Vector2(x, y);
        this.move_direction = new Vector2(0, 0);
    }

    to_object() {
        return {
            position: this.position.to_object(),
            move_direction: this.move_direction.to_object()
        }
    }
}