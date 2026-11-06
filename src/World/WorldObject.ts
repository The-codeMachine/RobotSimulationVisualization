import type { JSONObject } from "../utils/Json.js";
import { WorldData } from "./WorldData.js";

class WorldObject {
    private data: WorldData;

    constructor(json: JSONObject) {
        this.data = new WorldData(json);
    }
}