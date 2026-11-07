import type { JSONObject } from "../lib/Json.js";
import type { Transform } from "../lib/position/Transform.js";
import { WorldData } from "./WorldData.js";

class WorldObject {
    private data: WorldData;
    private transform: Transform;
    private readonly uniqueId: string;

    constructor(json: JSONObject, transform?: Transform, uniqueId?: string) {
        if (json && transform && uniqueId) {
            this.data = new WorldData(json);
            this.transform = transform;
            this.uniqueId = uniqueId;
        } else if (
            json !== null &&
            typeof json === 'object' &&
            !Array.isArray(json) &&
            'transform' in json &&
            'uniqueId' in json &&
            'data' in json
        ) {
            this.data = new WorldData(json.data);
            this.transform = jsonToTransform(json.transform);
            this.uniqueId = json.uniqueId;
        } else {
            throw new Error(`Invalid parameters for WorldObject constructor. 
                            Need either a complete json or data, transform and uniqueId`);
        }
    }

    public getData(): WorldData {
        return this.data;
    }

    public getTransform(): Transform {
        return this.transform;
    }

}