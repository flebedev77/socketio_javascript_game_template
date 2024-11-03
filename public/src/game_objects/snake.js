import globals from "../core/globals.js";
import { pick_random_from_array, Vector2 } from "../utils.js";

export class Snake {
    constructor(x, y, r, seg_amt, seg_len) {
        this.position = new Vector2(x, y);
        this.head_radius = r * 0.9;

        this.segment_radius = r;
        this.segment_amount = seg_amt;
        this.segment_length = seg_len;
        this.tail = [];

        this.move_direction = new Vector2(0, 0);
        this.speed = globals.player_speed.normal;

        this.weight_loss_delay = 0;

        this.is_local_player = false;

        this.ctx = globals.canvas_context;

        this.init();
    }

    init() {
        for (let i = 0; i < this.segment_amount; i++) {
            let anchor = (i == 0) ? this.position : this.tail[i - 1].b;
            this.tail.push(new Segment(
                anchor,
            ));
        }
        this.update_tail_radius();
    }

    draw() {
        this.ctx.fillStyle = globals.player_colors[0];
        this.ctx.beginPath();
        this.ctx.arc(this.position.x, this.position.y, this.head_radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.closePath();

        this.tail.forEach((segment) => {
            segment.draw();
        })
    }

    update() {
        this.draw();

        const delta_time = globals.delta_time;

        this.position.x += this.move_direction.x * this.speed * delta_time;
        this.position.y += this.move_direction.y * this.speed * delta_time;

        this.tail.forEach((segment) => {
            segment.update();
        })
        this.segment_amount = this.tail.length;

        if (this.is_local_player) {
            //keyboard movement
            if (globals.keys.last_input_time >= globals.mouse.last_input_time) {
                const move_vector = new Vector2(0, 0);

                if (globals.keys.left) move_vector.x += 1;
                if (globals.keys.right) move_vector.x -= 1;
                if (globals.keys.up) move_vector.y += 1;
                if (globals.keys.down) move_vector.y -= 1;

                this.move_direction = Vector2.normalized(move_vector);

                //mouse movement
            } else {
                //if snake gets too close to mouse, prefer keyboard movement
                if (Vector2.distance(
                    new Vector2(this.position.x, this.position.y),
                    new Vector2(globals.mouse.position.x, globals.mouse.position.y)
                ) > 2) {
                    this.move_direction = Vector2.normalized(new Vector2(
                        this.position.x - globals.mouse.position.x,
                        this.position.y - globals.mouse.position.y
                    ));
                } else {
                    globals.mouse.last_input_time = 0;
                }
            }

            this.sprint(globals.input_actions.sprint);
        }

    }

    sprint(sprinting) {
        const delta_time = globals.delta_time;

        this.speed = (sprinting) ? globals.player_speed.sprint : globals.player_speed.normal;

        if (sprinting) {
            this.weight_loss_delay += delta_time;
            if (this.weight_loss_delay > globals.player_sprint_weight_loss.rate && this.tail.length > globals.player_sprint_weight_loss.minumum_segments_for_loss) {
                this.weight_loss_delay = 0;
                this.tail.splice(
                    this.tail.length - globals.player_sprint_weight_loss.segment_loss,
                    globals.player_sprint_weight_loss.segment_loss
                );
                this.head_radius -= globals.player_sprint_weight_loss.segment_thickness_loss;
                this.segment_radius -= globals.player_sprint_weight_loss.segment_thickness_loss;

                this.update_tail_radius();
            }
        }
    }

    update_tail_radius() {
        for(let i = 0; i < this.tail.length; i++) {
            const seg = this.tail[i];
            seg.length = this.segment_length - (i / this.tail.length) * (this.segment_length - globals.player_tail_size_offset_from_zero);
            seg.radius = this.segment_radius - (i / this.tail.length) * (this.segment_radius - globals.player_tail_size_offset_from_zero);
            seg.color = globals.player_colors[i % globals.player_colors.length];
        }
    }

    eat(seg_amount, seg_radius) {
        let added_segs = [];
        for(let i = 0; i < seg_amount; i++) {
            const anchor = (i == 0) ? this.tail[this.tail.length-1].b : added_segs[i-1].b;

            added_segs.push(new Segment(
                anchor, //length and radius will be automatically corrected by update_tail_radius()
            ));
        }
        this.tail.push(...added_segs);

        this.segment_radius += seg_radius;
        this.head_radius += seg_radius * 0.5; //because head is radius, but segment its diameter

        this.update_tail_radius();
    }
}

class Segment {
    /**
    * Segment of the snake body
    * @param {Vector2} a - The anchor point
    * @param {number} len - Length of the segment
    * @param {number} radius - The thickness of the segment
    */
    constructor(a, len = 0, radius = 0, color = "red") {
        this.a = a;
        this.b = new Vector2(0, 0);
        this.radius = radius;
        this.length = len;

        this.color = color;

        this.ctx = globals.canvas_context;
    }

    draw() {
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = this.radius;
        this.ctx.lineCap = 'round';

        this.ctx.beginPath();
        this.ctx.moveTo(this.a.x, this.a.y);
        this.ctx.lineTo(this.b.x, this.b.y);
        this.ctx.stroke();
        this.ctx.closePath();
    }

    update() {
        const delta_time = globals.delta_time;

        //length restriction
        const b_pos = Vector2.normalized(Vector2.sub(this.a, this.b));
        this.b.x = this.a.x + b_pos.x * this.length;
        this.b.y = this.a.y + b_pos.y * this.length;
    }
}