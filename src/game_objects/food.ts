import { Vector2 } from "../core/utils";

export class Food {
    position: Vector2;
    radius: number;
    constructor(position: Vector2, radius: number) {
        this.position = position;
        this.radius = radius;
    }

    to_object() {
        return {
            position: this.position.to_object(),
            radius: this.radius,
        };
    }
}