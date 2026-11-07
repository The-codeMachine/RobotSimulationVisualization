import type { JsonObject } from "type-fest";
import { jsonToTransform, type Transform } from "../lib/position/Transform.js";

/**
 * This represents one complete world Object. This is not similar to RobotSimulation's
 * object. This may be a Robot, a wall, an empty, or even a device. This is intended
 * to represent anything within the world. Everything will have its own custom data 
 * pool of variables, as well as a transform representing its positional data and its
 * unique id. 
 * 
 * This class is designed to encapsulate that information.
 */
export class WorldObject {
    private data: JsonObject;
    private transform: Transform;
    private readonly uniqueId: string;

    constructor(json: JsonObject, transform?: Transform, uniqueId?: string) {
        if (json && transform && uniqueId) {
            this.data = json;
            this.transform = transform;
            this.uniqueId = uniqueId;
        } else if (json && !transform && !uniqueId) {
            this.data = json.data as JsonObject;
            this.transform = jsonToTransform(json.transform as JsonObject);
            this.uniqueId = json.uniqueId as string; 
        } else {
            throw new Error(`Invalid parameters for WorldObject constructor. 
                            Need either a complete json or data, transform and uniqueId`);
        }
    }

    /**
     * @returns the current data of this object
     */
    public getData(): JsonObject {
        return this.data;
    }

    /**
     * @returns the current transform of this object
     */
    public getTransform(): Transform {
        return this.transform;
    }

    /**
     * @returns the unique id of this object
     */
    public getUniqueId(): string {
        return this.uniqueId;
    }
}