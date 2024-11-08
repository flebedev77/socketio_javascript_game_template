import globals from "../core/globals.js";
import * as snake from "./snake.js";

//needs to be serializable
export class NetworkSnake {
    constructor(x, y, r, seg_amt, seg_len) {
        this.head_position = {
            x,
            y
        };
        this.head_radius = r;
        this.segment_amount = seg_amt;
        this.segment_length = seg_len;
        this.tail = [];
    }

    static toJSON(snake) {
        return JSON.stringify({
            head_position: {
                x: snake.head_position.x,
                y: snake.head_position.y
            },
            head_radius: snake.head_radius,
        });
    }

    static toNormalSnake(snake) {
        return new snake.Snake(
            snake.head_position.x,
            snake.head_position.y,
            snake.head_radius - (snake.head_radius * globals.player_head_size_multiplier),
            snake.segment_amount,
            snake.segment_length
        );
    }

    static fromNormalSnake(snake) {
        return new NetworkSnake(
            snake.position.x,
            snake.position.y,
            snake.segmant_radius,
            snake.segment_amount,
            snake.segment_length
        );
    }
}

export class NetworkTailSegment {
    constructor(a, b, len = 0, radius = 0) {
        this.a = a;
        this.b = b;
        this.radius = radius;
        this.length = len;
    }

    static toJSON(segment) {
        return JSON.stringify({
            a: {
                x: segment.a.x,
                y: segment.a.y,
            },
            b: {
                x: segment.b.x,
                y: segment.b.y,
            },
            radius: segment.radius,
            length: segment.length
        });
    }

    static toNormalSegment(segment) {
        return new snake.Segment(
            Vector2.clone(segment.a),
            segment.length,
            segment.radius
        );
    }
}