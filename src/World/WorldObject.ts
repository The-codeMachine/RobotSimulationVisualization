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
     * Creates a DOM element displaying a JSON value.
     *
     * Supports:
     * - Strings
     * - Numbers
     * - Booleans
     * - Null
     * - Arrays
     * - Nested objects
     */
    private renderValue(value: unknown): HTMLElement {
        if (value === null) {
            const element = document.createElement("span");
            element.className = "json-null";
            element.textContent = "null";
            return element;
        }

        if (Array.isArray(value)) {
            const container = document.createElement("div");
            container.className = "json-array";

            if (value.length === 0) {
                container.textContent = "Empty array";
                return container;
            }

            value.forEach((item, index) => {
                const entry = document.createElement("div");
                entry.className = "json-array-item";

                const indexLabel = document.createElement("span");
                indexLabel.className = "json-index";
                indexLabel.textContent = `[${index}]`;

                entry.append(indexLabel, this.renderValue(item));
                container.appendChild(entry);
            });

            return container;
        }

        if (typeof value === "object") {
            const container = document.createElement("div");
            container.className = "json-object";

            const entries = Object.entries(value);

            if (entries.length === 0) {
                container.textContent = "Empty object";
                return container;
            }

            for (const [key, childValue] of entries) {
                const entry = document.createElement("div");
                entry.className = "json-property";

                const keyElement = document.createElement("span");
                keyElement.className = "json-key";
                keyElement.textContent = key;

                const valueElement = document.createElement("div");
                valueElement.className = "json-value";
                valueElement.appendChild(this.renderValue(childValue));

                entry.append(keyElement, valueElement);
                container.appendChild(entry);
            }

            return container;
        }

        const element = document.createElement("span");

        element.className = `json-${typeof value}`;

        // textContent prevents JSON strings from being interpreted as HTML.
        element.textContent = String(value);

        return element;
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

    /**
     * Creates a visual representation of a WorldObject.
     *
     * @param worldObject The object to display.
     * @returns An HTMLDivElement containing all of its JSON data.
     */
    public display(): HTMLDivElement {
        const container = document.createElement("div");
        container.className = "world-object";

        // Header
        const header = document.createElement("div");
        header.className = "world-object-header";

        const title = document.createElement("h2");
        title.textContent = this.getType() ?? "WorldObject";

        const id = document.createElement("span");
        id.className = "world-object-id";
        id.textContent = this.getUniqueId();

        header.append(title, id);
        container.appendChild(header);

        // Glyph
        const glyph = this.getGlyph();

        if (glyph !== undefined) {
            const glyphElement = document.createElement("div");
            glyphElement.className = "world-object-glyph";
            glyphElement.textContent = glyph;

            container.appendChild(glyphElement);
        }

        // All original JSON data
        const dataHeading = document.createElement("h3");
        dataHeading.textContent = "Object Data";

        container.appendChild(dataHeading);
        container.appendChild(this.renderValue(this.getData()));

        return container;
    }
}
