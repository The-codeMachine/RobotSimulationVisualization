import type { Transform } from "../lib/position/Transform";
import type { Vector2 } from "../lib/position/Vector2";
import { loadFile } from "../services/file/file";
import { WorldObject } from "./WorldObject";

/**
 * Acts as a similar purpose to World in RobotSimulation. It simply has a bunch of objects that
 * it encapsulates. It allows complete modification and read access to objects. It is constructed
 * from a JSON file path. 
 */
export class World {
    private objects: Map<Vector2, WorldObject>;

    constructor(filePath: string) {
        this.objects = new Map<Vector2, WorldObject>();

        try {
            const data = loadFile(filePath);
            this.parseJSONToObjects(JSON.parse(data));
        } catch (error) {
            console.error(`Failed to load file:`, error);
            throw error;
        }

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

    private parseJSONToObjects(json: string): void {

    }
}