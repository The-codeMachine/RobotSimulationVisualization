import type { JsonObject } from "type-fest";
import { jsonToVector2, vector2ToJson, type Vector2 } from "./Vector2.js";

/**
 * Transform represents the full positional information of an Object (rotation and location).
 */
export interface Transform {
    position: Vector2;
    rotation: number;
}

/**
 * Converts JSON into a transform.
 * 
 * @param json 
 * @returns the transform constructed from JSON
 */
export function jsonToTransform(json: JsonObject): Transform {
    return { position: jsonToVector2(json.vector2 as JsonObject), rotation: json.rotation as number };
}

/**
 * Converts a transform object into JSON
 * 
 * @param transform 
 * @returns the JSON representation of transform
 */
export function transformToJSON(transform: Transform): JsonObject {
    return { position: vector2ToJson(transform.position), rotation: transform.rotation };
}