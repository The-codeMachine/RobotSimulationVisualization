import type { JsonObject } from "type-fest";
import { jsonToTransform, type Transform } from "../lib/position/Transform.js";
import type { Vector2 } from "../lib/position/Vector2.js";

/**
 * Axis-aligned bounding box collider.
 *
 * The coordinates are expressed in world space.
 */
export interface AABBCollider {
    type: "AABBCollider";
    data: {
        minimum: Vector2;
        maximum: Vector2;
    };
}

/**
 * Represents one complete object within the world.
 *
 * Objects can represent walls, robots, devices, empty objects,
 * or any other entity that exists within the world.
 *
 * The original JSON is preserved, while commonly accessed
 * properties are exposed through typed getters.
 */
export class WorldObject {
    private readonly data: JsonObject;
    private readonly transform: Transform;
    private readonly uniqueId: string;
    private readonly collider?: AABBCollider;

    constructor(json: JsonObject) {
        if (!json || typeof json !== "object") {
            throw new TypeError("Invalid WorldObject JSON.");
        }

        if (typeof json.unique_id !== "string" || !json.unique_id) {
            throw new TypeError("WorldObject requires a valid unique_id.");
        }

        if (!json.transform || typeof json.transform !== "object") {
            throw new TypeError("WorldObject requires a valid transform.");
        }

        this.data = json;
        this.transform = jsonToTransform(json.transform as JsonObject);
        this.uniqueId = json.unique_id;

        this.collider = this.parseCollider(json.collider);
    }

    /**
     * Parses and validates the collider from the object's JSON.
     */
    private parseCollider(value: unknown): AABBCollider | undefined {
        if (value === undefined || value === null) {
            return undefined;
        }

        if (typeof value !== "object" || Array.isArray(value)) {
            throw new TypeError("Invalid collider definition.");
        }

        const collider = value as Record<string, unknown>;
        if (collider.type !== "AABBCollider") {
            throw new TypeError(`Unsupported collider type: ${String(collider.type)}`);
        }

        if (typeof collider.data !== "object" ||
            collider.data === null ||
            Array.isArray(collider.data)
        ) {
            throw new TypeError("Invalid AABB collider data.");
        }

        const data = collider.data as Record<string, unknown>;

        const minimum = data.minimum;
        const maximum = data.maximum;

        const isVector2 = (vector: unknown): vector is { x: number; y: number } => {
            if (typeof vector !== "object" ||
                vector === null ||
                Array.isArray(vector)
            ) {
                return false;
            }

            const v = vector as Record<string, unknown>;

            return (
                typeof v.x === "number" &&
                Number.isFinite(v.x) &&
                typeof v.y === "number" &&
                Number.isFinite(v.y)
            );
        };

        if (!isVector2(minimum) || !isVector2(maximum)) {
            throw new TypeError("Invalid AABB minimum or maximum.");
        }

        if (minimum.x > maximum.x || minimum.y > maximum.y) {
            throw new RangeError("AABB minimum cannot exceed its maximum.");
        }

        return {
            type: "AABBCollider",
            data: {
                minimum,
                maximum
            }
        };
    }

    /**
     * @returns The original JSON data for this object.
     */
    public getData(): JsonObject {
        return this.data;
    }

    /**
     * @returns The object's transform.
     */
    public getTransform(): Transform {
        return this.transform;
    }

    /**
     * @returns The object's unique identifier.
     */
    public getUniqueId(): string {
        return this.uniqueId;
    }

    /**
     * @returns The object's glyph, if defined.
     */
    public getGlyph(): string | undefined {
        const glyph = this.data.glyph;
        return typeof glyph === "string" ? glyph : undefined;
    }

    /**
     * @returns The object's type, if defined.
     */
    public getType(): string | undefined {
        const type = this.data.type;
        return typeof type === "string" ? type : undefined;
    }

    /**
     * @returns The object's AABB collider, if one exists.
     */
    public getCollider(): AABBCollider | undefined {
        return this.collider;
    }
}
