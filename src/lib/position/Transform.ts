import { type Vector2 } from "./Vector2.js";

/**
 * Transform represents the full positional information of an Object (rotation and location).
 */
interface Transform {
    position: Vector2;
    rotation: number;
}