/**
 * This Object class is a shell of the real one in the RobotSimulation. It simply
 * holds positional data, uniqueId, and data. These can be access, updated, deleted,
 * etc. 
 * 
 * UniqueId is a string. Data is JSON. Data is loaded from the JSON "data" table. 
 * 
 */
export class Object {
    uniqueId: string;
    data: Record<string, any>;

    constructor(json: JSON) {
        this.uniqueId = "loading";
        this.data = {};
        
        this.loadFromJSON(json);
    }

    public getUniqueId(): string {
        return this.uniqueId;
    }

    public getData(): Record<string, any> {
        return this.data;
    }

    public updateData(data: Record<string, any>): void {
        this.data = data;
    }

    public updateEntry(id: string, value: any): void {
        this.data[id] = value;
    }

    /**
     * Loads an Object from its JSON object. This is meant for things
     * like the JSON file we load from. 
     * 
     * @param json 
     */
    private loadFromJSON(json: JSON): void {
        
    }
}