import globals from "../core/globals";
import { aabb_collision, Rect2, Vector2 } from "../core/utils";

export class Snake {
    position: Vector2;
    move_direction: Vector2;
    speed: number;

    segment_amount: number;
    segment_radius: number;
    head_radius: number;
    constructor(x: number, y: number) {
        this.position = new Vector2(x, y);
        this.speed = globals.player_speed.normal;

        this.segment_amount = globals.player_segment.amount;
        this.segment_radius = globals.player_segment.radius;
        this.head_radius = globals.player_segment.radius * globals.player_head_size_multiplier;

        this.move_direction = new Vector2(0, 0);
    }

    update() {
        this.position.x += this.move_direction.x * this.speed * globals.delta_time;
        this.position.y += this.move_direction.y * this.speed * globals.delta_time;
    }

    sprint(sprinting: boolean) {
        this.speed = (sprinting) ? globals.player_speed.sprint : globals.player_speed.normal;
    }

    check_eat() {
        for(let i = globals.food_list.length-1; i >= 0; i--) {
            const food_element = globals.food_list[i];

            // if (Vector2.magnitude(Vector2.sub(food_element.position, this.position)) < this.head_radius + globals.food_radius) {
            if (aabb_collision(
                new Rect2(
                    food_element.position.x - food_element.radius,
                    food_element.position.y - food_element.radius,
                    food_element.radius*2,
                    food_element.radius*2,
                ),
                new Rect2(
                    this.position.x - this.head_radius,
                    this.position.y - this.head_radius,
                    this.head_radius*2,
                    this.head_radius*2,
                ),
            )) {
                this.segment_radius += globals.food_give_radius_amount;
                this.segment_amount += globals.food_give_segment_amount;

                this.head_radius = this.segment_radius * globals.player_head_size_multiplier;
                return true;
            }
        }

        return false;
    }

    to_object() {
        return {
            position: this.position.to_object(),
            move_direction: this.move_direction.to_object(),
            speed: this.speed,
            head_radius: this.head_radius,
            segment_radius: this.segment_radius,
            segment_amount: this.segment_amount,
        }
    }
}