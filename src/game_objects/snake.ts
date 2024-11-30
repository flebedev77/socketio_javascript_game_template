import globals from "../core/globals";
import { aabb_collision, Rect2, Vector2 } from "../core/utils";

export class Snake {
    position: Vector2;
    move_direction: Vector2;
    speed: number;

    segment_amount: number;
    segment_radius: number;
    segment_length: number;
    head_radius: number;

    tail: Segment[];

    constructor(x: number, y: number) {
        this.position = new Vector2(x, y);
        this.speed = globals.player_speed.normal;

        this.segment_amount = globals.player_segment.amount;
        this.segment_length = globals.player_segment.length;
        this.segment_radius = globals.player_segment.radius;
        this.head_radius = globals.player_segment.radius * globals.player_head_size_multiplier;

        this.tail = [];

        this.move_direction = new Vector2(0, 0);

        this.init();
    }

    init() {
        this.tail = [];
        for (let i = 0; i < this.segment_amount; i++) {
            let anchor = (i == 0) ? this.position : this.tail[i - 1].b;
            this.tail.push(new Segment(
                anchor,
            ));
        }
        this.update_tail_radius();
    }

    update() {
        this.position.x += this.move_direction.x * this.speed * globals.delta_time;
        this.position.y += this.move_direction.y * this.speed * globals.delta_time;

        this.tail.forEach((seg) => {
            seg.update();
        })
    }

    sprint(sprinting: boolean) {
        this.speed = (sprinting) ? globals.player_speed.sprint : globals.player_speed.normal;
    }

    check_eat() {
        for (let i = globals.food_list.length - 1; i >= 0; i--) {
            const food_element = globals.food_list[i];

            // if (Vector2.magnitude(Vector2.sub(food_element.position, this.position)) < this.head_radius + globals.food_radius) {
            if (aabb_collision(
                new Rect2(
                    food_element.position.x - food_element.radius,
                    food_element.position.y - food_element.radius,
                    food_element.radius * 2,
                    food_element.radius * 2,
                ),
                new Rect2(
                    this.position.x - this.head_radius,
                    this.position.y - this.head_radius,
                    this.head_radius * 2,
                    this.head_radius * 2,
                ),
            )) {
                this.segment_radius += globals.food_give_radius_amount;
                this.segment_amount += globals.food_give_segment_amount;

                this.head_radius = this.segment_radius * globals.player_head_size_multiplier;
                globals.food_list.splice(i, 1);
                return true;
            }
        }

        return false;
    }

    update_tail_radius() {
        this.head_radius = this.segment_radius * globals.player_head_size_multiplier;

        for (let i = 0; i < this.tail.length; i++) {
            const seg = this.tail[i];
            seg.length = this.segment_length - (i / this.tail.length) * (this.segment_length - ((globals.player_tail_size_offset_from_zero / this.segment_length) * this.segment_length));
            seg.radius = this.segment_radius - (i / this.tail.length) * (this.segment_radius - ((globals.player_tail_size_offset_from_zero / this.segment_radius) * this.segment_radius));
        }
        this.tail.forEach((seg) => {
            seg.update();
        })
    }


    eat(seg_amount: number, seg_radius: number) {
        if (this.tail.length == 0) throw new RangeError("Can't eat when tail is empty");

        let added_segs = [];
        for (let i = 0; i < seg_amount; i++) {
            const anchor: Vector2 = (i == 0) ? this.tail[this.tail.length - 1].b : added_segs[i - 1].b;

            added_segs.push(new Segment(
                anchor, //length and radius will be automatically corrected by update_tail_radius()
            ));
        }
        this.tail.push(...added_segs);

        this.segment_radius += seg_radius;
        this.segment_length += seg_radius;

        this.update_tail_radius();
    }

    to_object() {
        return {
            position: this.position.to_object(),
            move_direction: this.move_direction.to_object(),
            speed: this.speed,
            head_radius: this.head_radius,
            segment_radius: this.segment_radius,
            segment_amount: this.segment_amount,
            segmnet_length: this.segment_length,
            // tail: this.tail.map((seg) => seg.to_object()),
        }
    }
}

export class Segment {
    /**
    * Segment of the snake body
    * @param {Vector2} a - The anchor point
    * @param {number} len - Length of the segment
    * @param {number} radius - The thickness of the segment
    */
    a: Vector2;
    b: Vector2;
    radius: number;
    length: number;
    constructor(a: Vector2, len = 0, radius = 0) {
        this.a = a;
        this.b = new Vector2(0, 0);
        this.radius = radius;
        this.length = len;
    }

    update() {
        //length restriction
        const b_pos = Vector2.normalized(Vector2.sub(this.a, this.b));
        this.b.x = this.a.x + b_pos.x * this.length;
        this.b.y = this.a.y + b_pos.y * this.length;
    }

    to_object() {
        return {
            a: this.a.to_object(),
            b: this.b.to_object(),
            radius: this.radius,
            length: this.length
        }
    }
}