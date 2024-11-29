import type { Segment } from "../game_objects/snake";
import { log_warning } from "../logger";
import globals from "./globals";

type Vector2_Type = {
    x: number;
    y: number;
}

export class Rect2 {
    position: Vector2;
    width: number;
    height: number;
    constructor(x: number, y: number, w: number, h: number) {
        this.position = new Vector2(x, y);
        this.width = w;
        this.height = h;
    }
}

export class Vector2 {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    static magnitude(vector: Vector2) {
        const ix = -vector.x;
        const iy = -vector.y;
        return Math.sqrt(ix * ix + iy * iy);
    }

    static normalized(vector: Vector2) {
        const ix = -vector.x;
        const iy = -vector.y;
        const mag = 1 / Math.sqrt(ix * ix + iy * iy);
        return new Vector2(
            ix * mag,
            iy * mag
        );
    }

    static sub(a: Vector2, b: Vector2) {
        return new Vector2(
            a.x - b.x,
            a.y - b.y
        );
    }

    static from_object(vec: Vector2_Type) {
        return new Vector2(vec.x, vec.y);
    }

    to_object() {
        return { x: this.x, y: this.y };
    }
}

// export function 
/**
 * Returns an array of serializable objects
 * 
 * @param input - Array of unserializable objects. Each object must have a to_object() method, that returns a serializable object of itself.
 * @returns A serializable array of objects
 */
export function class_list_to_object_list(input: any[]) {
    const arr = [];
    for (let i = 0; i < input.length; i++) {
        arr.push(input[i].to_object());
    }
    return arr;
}


/**
 * Turns unserializable object to a object with serializable keys
 *  
 *  @param input - An object with unserializable keys. Each subobject must have a to_object() method, that returns a serializable object of itself.
 *  @returns A serializable object
 */
export function class_object_to_serializable_object(input: { [id: string]: any }) {
    const obj: { [id: string]: any } = {};
    for (const key in input) {
        obj[key] = input[key].to_object();
    }
    return obj;
}

export function aabb_collision(a: Rect2, b: Rect2) {
    return (
        a.position.x + a.width > b.position.x &&
        a.position.x < b.position.x + b.width &&
        a.position.y + a.height > b.position.y &&
        a.position.y < b.position.y + b.height
    );
}


function lineDistance(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number) {
    // Function to calculate the distance between two line segments (x1, y1 -> x2, y2) and (x3, y3 -> x4, y4)

    const denominator = (x2 - x1) * (y4 - y3) - (y2 - y1) * (x4 - x3);

    // Parallel lines
    if (denominator === 0) return null;

    const t = ((x1 - x3) * (y4 - y3) - (y1 - y3) * (x4 - x3)) / denominator;
    const u = ((x1 - x3) * (y2 - y1) - (y1 - y3) * (x2 - x1)) / denominator;

    // Check if the intersection point lies on both segments
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
        // Intersection point (px, py)
        const px = x1 + t * (x2 - x1);
        const py = y1 + t * (y2 - y1);

        return { x: px, y: py };
    }

    // No intersection
    return null;
}

export function linesIntersectWithRadius(line1: any, line2: any) {
    const { x1, y1, x2, y2, r1 } = line1;
    const { x3, y3, x4, y4, r2 } = line2;

    // Check if the lines themselves intersect
    const intersection = lineDistance(x1, y1, x2, y2, x3, y3, x4, y4);

    if (intersection) {
        return true;  // Lines intersect at a point
    }

    // Check if the distance between the closest points of the lines is less than or equal to the sum of radii
    const dist1 = Math.hypot(x1 - x3, y1 - y3);
    const dist2 = Math.hypot(x2 - x3, y2 - y3);
    const dist3 = Math.hypot(x1 - x4, y1 - y4);
    const dist4 = Math.hypot(x2 - x4, y2 - y4);

    const minDist = Math.min(dist1, dist2, dist3, dist4);
    const combinedRadii = r1 + r2;

    // If the minimum distance between any two points on the lines is less than or equal to the sum of radii, they intersect
    if (minDist <= combinedRadii) {
        return true;
    }

    // Otherwise, they do not intersect
    return false;
}


export function distancePointToLine(x1: number, y1: number, x2: number, y2: number, cx: number, cy: number) {
  // Compute the perpendicular distance from the point (cx, cy) to the line (x1, y1) -> (x2, y2)
  
  const lineLengthSquared = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
  if (lineLengthSquared === 0) return Math.hypot(cx - x1, cy - y1); // Line is a point, return distance to the point

  // Projection formula to get the closest point on the line
  let t = ((cx - x1) * (x2 - x1) + (cy - y1) * (y2 - y1)) / lineLengthSquared;
  t = Math.max(0, Math.min(1, t)); // Clamp t to the segment

  const closestX = x1 + t * (x2 - x1);
  const closestY = y1 + t * (y2 - y1);

  // Return the distance from the circle center to the closest point on the line
  return Math.hypot(cx - closestX, cy - closestY);
}

export function lineCircleCollision(line: any, circle: any) {
  const { x1, y1, x2, y2, lineRadius } = line;
  const { cx, cy, cr } = circle;

  // Calculate the perpendicular distance from the circle's center to the line
  const distance = distancePointToLine(x1, y1, x2, y2, cx, cy);

  // If the distance from the circle to the line is less than or equal to the sum of the radii, they collide
  if (distance <= cr + lineRadius) {
    return true;  // Collision occurs
  }

  return false;  // No collision
}

export function line_circle_collision(line: Segment, circle: { x: number, y: number, radius: number}) {
    return lineCircleCollision(
        {
            x1: line.a.x,
            x2: line.b.x,
            y1: line.a.y,
            y2: line.b.y,
            lineRadius: line.radius,
        },
        {
            cx: circle.x,
            cy: circle.y,
            cr: circle.radius,
        },
    );
}

export function get_player(id: string) {
    const p = globals.players[id];
    if (p != undefined) {
        return p;
    } else {
        const msg = `Could not get_player ${id}`;
        log_warning(msg);
        return null;
    }
}