export type JSONPrimitive = 
    | string
    | number 
    | boolean 
    | null;

export type JSONValue = 
    | JSONPrimitive
    | JSONValue[] 
    | { [key: string]: JSONValue };

export type JSONObject = {
    [key: string]: JSONValue;
};

export class SafeJSON {
    /**
     * Checks if a JSONValue is a valid JSONObject (non-null object, not an array).
     */
    static isObject(value: JSONValue): value is JSONObject {
        return value !== null && typeof value === 'object' && !Array.isArray(value);
    }

    /**
     * Safely extracts a string property, returning undefined if it's missing or the wrong type.
     */
    static getString(json: JSONValue, key: string): string | undefined {
        if (this.isObject(json) && typeof json[key] === 'string') {
            return json[key] as string;
        }
        return undefined;
    }

    /**
     * Safely extracts a number property.
     */
    static getNumber(json: JSONValue, key: string): number | undefined {
        if (this.isObject(json) && typeof json[key] === 'number') {
            return json[key] as number;
        }
        return undefined;
    }

    /**
     * Safely extracts a boolean property.
     */
    static getBoolean(json: JSONValue, key: string): boolean | undefined {
        if (this.isObject(json) && typeof json[key] === 'boolean') {
            return json[key] as boolean;
        }
        return undefined;
    }

    /**
     * Safely extracts a nested JSONObject property (excluding arrays and null).
     */
    static getObject(json: JSONValue, key: string): JSONObject | undefined {
        if (this.isObject(json)) {
            const val = json[key];
            if (this.isObject(val)) {
                return val;
            }
        }
        return undefined;
    }

    /**
     * Safely extracts a JSONValue array property.
     */
    static getArray(json: JSONValue, key: string): JSONValue[] | undefined {
        if (this.isObject(json)) {
            const val = json[key];
            if (Array.isArray(val)) {
                return val;
            }
        }
        return undefined;
    }
}