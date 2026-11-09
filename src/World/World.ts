import type { JsonObject } from "type-fest";
import type { Transform } from "../lib/position/Transform";
import { jsonToVector2, type Vector2 } from "../lib/position/Vector2";
import { WorldObject } from "./WorldObject";
import { WorldGrid } from "./WorldGrid";

/**
 * Acts as a similar purpose to World in RobotSimulation. It simply has a bunch of objects that
 * it encapsulates. It allows complete modification and read access to objects. It is constructed
 * from a JSON file path. 
 */
export class World {
    private objects: Map<Vector2, WorldObject>;
    private grid: WorldGrid;

    constructor(json: JsonObject) {
        this.objects = new Map<Vector2, WorldObject>();
        this.parseJSONToObjects(json);

        this.grid = new WorldGrid(this.objects)
    }

    /**
     * @returns the map of objects location in the world
     */
    public getObjects(): Map<Vector2, WorldObject> {
        return this.objects;
    }

    /**
     * Gets the WorldObject at a specific location
     * 
     * @param position (Transform || Vector2)
     * @returns the object at a certai Vector2 position
     */
    public getObject(position: Transform | Vector2): WorldObject | undefined {
        return this.objects.get(this.safeParsePosition(position));
    }

    /**
     * @param position 
     * @returns whether or not an object exists at a certain position
     */
    public hasObject(position: Transform | Vector2): boolean {
        return this.objects.has(this.safeParsePosition(position));
    }

    /**
     * Inserts a new value into the objects. 
     * 
     * @note if the element already exists, it will be updated
     * 
     * @param position 
     * @param object 
     */
    public insertObject(position: Transform | Vector2, object: WorldObject): void {
        this.objects.set(this.safeParsePosition(position), object);
    }

    /**
     * Deletes an object from the World. 
     * 
     * @param position 
     * @returns whether or not the deletion was successful or not (true if it was successful)
     */
    public deleteObject(position: Transform | Vector2): boolean {
        return this.objects.delete(this.safeParsePosition(position));
    }

    /**
     * Displays the map by returning an HTML div element meant to represent its elements.
     * 
     * @param a 
     * @param b 
     * @param pixelsPerUnit 
     * @returns the constructed HTML div element to represent the world
     */
    public display(a: Vector2, b: Vector2, pixelsPerUnit?: number): HTMLDivElement {
        return this.grid.display(a, b, pixelsPerUnit);
    }

    /**
     * Gets the target Vector2 from either a Transform or Vector2
     * position passed. 
     * 
     * @param position 
     * @returns the Vector2 constructed from the Transform or Vector2 
     */
    private safeParsePosition(position: Transform | Vector2): Vector2 {
        if ("type" in position && position.type === "transform") {
            return (position as Transform).position;
        } else {
            return position as Vector2;
        }
    }

    private isJsonObject(value: unknown): value is JsonObject {
        return (
            typeof value === "object" &&
            value !== null &&
            !Array.isArray(value)
        );
    }

    private parseJSONToObjects(json: JsonObject): void {
        // Validate version
        if (json.version !== 1) {
            throw new Error(`Unsupported world JSON version: ${json.version}`);
        }

        // Validate objects array
        if (!Array.isArray(json.objects)) {
            throw new Error("World JSON must contain an objects array");
        }

        for (const object of json.objects) {
            if (!this.isJsonObject(object)) {
                throw new Error("Invalid object encountered in world JSON");
            }

            // Validate object properties
            if (typeof object.type !== "string" ||
                typeof object.glyph !== "string" ||
                typeof object.unique_id !== "string"
            ) {
                throw new Error("Invalid WorldObject properties");
            }

            // Validate transform
            const transform = object.transform;

            if (!this.isJsonObject(transform)) {
                throw new Error(`Invalid transform for ${object.unique_id}`);
            }

            // Validate Vector2
            const vector2 = transform.vector2;

            if (!this.isJsonObject(vector2)) {
                throw new Error(`Invalid Vector2 for ${object.unique_id}`);
            }

            if (typeof vector2.x !== "number" ||
                typeof vector2.y !== "number" ||
                typeof transform.rotation !== "number"
            ) {
                throw new Error(`Invalid position for ${object.unique_id}`);
            }

            // Construct WorldObject
            const worldObject = new WorldObject({
                data: {
                    type: object.type,
                    glyph: object.glyph
                },
                transform: transform,
                uniqueId: object.unique_id
            });

            // Insert into world
            const position: Vector2 = jsonToVector2(vector2);

            this.insertObject(position, worldObject);
        }
    }
}