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

/**
 * Converts a Vector2 to a string
 * 
 * @param vector 
 * @returns the Vector2 as a string
 */
export function vector2ToString(vector: Vector2): string {
    return `${vector.x},${vector.y}`;
}

/**
 * Converts a string into a Vector2 if possible. 
 * 
 * @note will throw an error if conversion is not possible
 * @param str 
 * @returns the string as a Vector2 object
 */
export function stringToVector2(str: string): Vector2 {
    const parts = str.split(",");

    if (parts.length !== 2) {
        throw new Error(`Invalid position key: ${str}`);
    }

    const x = Number(parts[0]);
    const y = Number(parts[1]);

    if (!Number.isFinite(x) || !Number.isFinite(y)) {
        throw new Error(`Invalid coordinates in position key: ${str}`);
    }

    return { x, y };
}