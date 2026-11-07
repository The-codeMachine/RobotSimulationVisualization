import type { JSONObject } from "../Json.js";
import { type Vector2 } from "./Vector2.js";

/**
 * Transform represents the full positional information of an Object (rotation and location).
 */
export interface Transform {
    position: Vector2;
    rotation: number;
}

export function jsonToTransform(json: JSONObject): Transform | undefined {
    if (
        json !== null &&
        typeof json === 'object' &&
        Array.isArray(json) &&
        'vector2' in json &&
        'rotation' in json
    ) {
        const rotation = json.rotation;
        const position = jsonToVector2(json.vector2);
        
        return { position, rotation };
    }

    return undefined;
}