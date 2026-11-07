import type { JsonObject } from "type-fest";

/**
 * Represents a Vector2 instance. 
 */
export interface Vector2 {
    x: number;
    y: number;
}

/**
 * Converts a Vector2 to a JSONObject
 * 
 * @param vector2 
 * @returns the constructed JSONObject
 */
export function vector2ToJson(vector2: Vector2): JsonObject {
    return { x: vector2.x, y: vector2.y };
}

/**
 * Converts JSON to a Vector2
 * 
 * @param json 
 * @returns the constructed Vector2 from JSON
 */
export function jsonToVector2(json: JsonObject): Vector2 {
    return { x: json.x as number, y: json.y as number};
}