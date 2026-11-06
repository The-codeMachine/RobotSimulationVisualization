import { type JSONValue, type JSONObject } from "../utils/Json.js";

/**
 * WorldData is a class that represents a type of data found within the world.
 * Because each object in the RobotSimulation library has the option to add a 
 * data table, this class was designed to meet the expectations of said data 
 * table.
 * 
 * This class allows for the complete access and manipulation of a JSON-like
 * array structure designed to duplicate the responsibilies and functionality
 * of the data table. 
 */
export class WorldData {
    private data: JSONObject;
    
    constructor(data: JSONObject = {}) {
        this.data = structuredClone(data);
    }

    /**
     * Gets all of this particular object's data.
     * 
     * @returns a JSONObject representing all data this object encapsulates.
     */
    public getData(): JSONObject {
        return this.data;
    }

    /**
     * Gets a particular value from the data encapsulated by this class. Either
     * returns T or undefined. 
     * 
     * @param path 
     * @returns T or undefined depending whether or not it exists as path. 
     */
    public get<T extends JSONValue>(path: string): T | undefined {
        const keys = path.split(".");
        let current: JSONValue = this.data;

        for (const key of keys) {
            if (typeof current !== "object" ||
                current === null ||
                Array.isArray(current) ||
                !(key in current)
            ) {
                return undefined;
            }

            current = current[key];
        }

        return current as T;
    }

    /**
     * Sets the value of a particular key to a JSON Value. 
     * 
     * @note This function will override any previous values
     * @note This function will throw an error if it encounters one
     * 
     * @param path 
     * @param value 
     */
    public set(path: string, value: JSONValue): void {
        const keys = path.split(".");
        const finalKey = keys.pop();

        if (!finalKey || keys.some(key => !key)) {
            throw new Error("Invalid data path");
        }

        let current: JSONObject = this.data;
        for (const key of keys) {
            const existing = current[key];

            if (typeof existing !== "object" ||
                existing === null ||
                Array.isArray(existing)
            ) {
                throw new Error(`Invalid data path: ${path}`);
            }

            current = existing;
        }

        current[finalKey] = structuredClone(value);
    }

    /**
     * Checks whether a certain path has a value. 
     * 
     * @param path 
     * @returns true if the path has a value and false otherwise.
     */
    public has(path: string): boolean {
        return this.get(path) !== undefined;
    }

    /**
     * Removes the value and key from the path if it exists. 
     * 
     * @param path 
     * @returns true if deletion was successful and false otherwise. 
     */
    public remove(path: string): boolean {
        const keys = path.split(".");
        const finalKey = keys.pop();

        if (!finalKey || keys.some(key => !key)) {
            return false;
        }

        let current: JSONObject = this.data;
        for (const key of keys) {
            const exisiting = current[key];

            if (typeof exisiting !== "object" ||
                exisiting === null ||
                Array.isArray(exisiting)
            ) {
                return false;
            }

            current = exisiting;
        }

        return delete current[finalKey];
    }
};