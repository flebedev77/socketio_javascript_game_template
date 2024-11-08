type Vector2_Type = {
    x: Number;
    y: Number;
}


export class Vector2 {
    x: Number;
    y: Number;
    constructor(x: Number, y: Number) {
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