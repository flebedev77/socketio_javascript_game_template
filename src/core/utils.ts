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
/**
 * Returns an array of serializable objects
 * 
 * @param input - Array of unserializable objects. Each object must have a to_object() method, that returns a serializable object of itself.
 * @returns A serializable array of objects
 */
export function class_list_to_object_list(input: any[]) {
    const arr = [];
    for(let i = 0; i < input.length; i++) {
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
export function class_object_to_serializable_object(input: {[id: string]: any}) {
    const obj: {[id: string]: any} = {};
    for (const key in input) {
        obj[key] = input[key].to_object();
    }
    return obj;
}