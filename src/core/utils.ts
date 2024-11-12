type Vector2_Type = {
    x: number;
    y: number;
}


export class Vector2 {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    static from_object(vec: Vector2_Type) {
        return new Vector2(vec.x, vec.y);
    }

    to_object() {
        return { x: this.x, y: this.y };
    }
}

// export function 