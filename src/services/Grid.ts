import { type Vector2 } from "../lib/position/Vector2";
import type { WorldObject } from "../World/WorldObject";

export class Grid {
    // Spatial bucket mapped to an array of objects inside that cell area
    private buckets = new Map<number | bigint, { pos: Vector2; value: string }[]>();
    
    // Tracks where positions are stored for instant updates/deletions
    private positionToBucketKey = new Map<Vector2, number | bigint>();

    // Determines the spatial cell width/height. Adjust this based on query sizes!
    private readonly cellSize: number = 10;

    constructor(map: Map<Vector2, WorldObject>) {
        this.fillGrid(map);
    }

    /**
     * Highly performant, allocation-free numeric hash combining bucket integers.
     * Maps fractional x/y positions into unique numeric grid keys.
     */
    private getBucketKey(x: number, y: number): number {
        const bx = Math.floor(x / this.cellSize) | 0;
        const by = Math.floor(y / this.cellSize) | 0;
        // Fast 32-bit integer pairing hash (handles negative and positive coordinates cleanly)
        return ((bx & 0xFFFF) << 16) | (by & 0xFFFF);
    }

    /**
     * Mutably inserts a new vector position and its corresponding string value into the grid.
     */
    public insert(pos: Vector2, value: string): void {
        const key = this.getBucketKey(pos.x, pos.y);
        
        if (!this.buckets.has(key)) {
            this.buckets.set(key, []);
        }
        
        this.buckets.get(key)!.push({ pos, value });
        this.positionToBucketKey.set(pos, key);
    }

    /**
     * Mutably updates an existing Vector2 position's coordinates or inner value,
     * dynamically re-bucketing it if it crossed spatial cell boundaries.
     */
    public update(pos: Vector2, newValue?: string): void {
        const oldKey = this.positionToBucketKey.get(pos);
        const newKey = this.getBucketKey(pos.x, pos.y);
        
        if (oldKey === undefined) {
            // If it wasn't tracked, treat it as a fresh insertion
            if (newValue !== undefined) this.insert(pos, newValue);
            return;
        }

        // Find the record in the old spatial bucket
        const oldBucket = this.buckets.get(oldKey);
        if (oldBucket) {
            const idx = oldBucket.findIndex(item => item.pos === pos);
            if (idx !== -1) {
                const item = oldBucket[idx];
                if (newValue !== undefined) item.value = newValue;

                // If the object migrated to a different spatial cell, shift its bucket location
                if (oldKey !== newKey) {
                    oldBucket.splice(idx, 1);
                    if (oldBucket.length === 0) this.buckets.delete(oldKey);

                    if (!this.buckets.has(newKey)) this.buckets.set(newKey, []);
                    this.buckets.get(newKey)!.push(item);
                    this.positionToBucketKey.set(pos, newKey);
                }
                return;
            }
        }
        
        // Fallback fallback if references mismatched inside tracking maps
        if (newValue !== undefined) this.insert(pos, newValue);
    }

    /**
     * Mutably removes a Vector2 position and its data entirely from the spatial tracking grid.
     */
    public delete(pos: Vector2): boolean {
        const key = this.positionToBucketKey.get(pos);
        if (key === undefined) return false;

        const bucket = this.buckets.get(key);
        if (bucket) {
            const idx = bucket.findIndex(item => item.pos === pos);
            if (idx !== -1) {
                bucket.splice(idx, 1);
                if (bucket.length === 0) this.buckets.delete(key);
                this.positionToBucketKey.delete(pos);
                return true;
            }
        }
        return false;
    }

    /**
     * Queries only the localized spatial buckets overlapping the bounding box.
     * Safely processes real/floating-point values with O(1) cell matching.
     */
    public queryRectangle(min: Vector2, max: Vector2): { pos: Vector2; value: string }[] {
        const results: { pos: Vector2; value: string }[] = [];

        const startX = Math.floor(min.x / this.cellSize);
        const endX = Math.floor(max.x / this.cellSize);
        const startY = Math.floor(min.y / this.cellSize);
        const endY = Math.floor(max.y / this.cellSize);

        for (let bx = startX; bx <= endX; bx++) {
            for (let by = startY; by <= endY; by++) {
                // Reconstruct the exact localized cell key integer
                const key = ((bx & 0xFFFF) << 16) | (by & 0xFFFF);
                const bucket = this.buckets.get(key);
                
                if (!bucket) continue;

                // Fine-tuned distance filtering inside the cell loop
                for (let i = 0; i < bucket.length; i++) {
                    const item = bucket[i];
                    if (
                        item.pos.x >= min.x &&
                        item.pos.x <= max.x &&
                        item.pos.y >= min.y &&
                        item.pos.y <= max.y
                    ) {
                        results.push(item);
                    }
                }
            }
        }

        return results;
    }

    /**
     * Gets the Object's glyph as a String from a WorldObject.
     */
    private parseWorldObject(obj: WorldObject): string {
        const data = obj.getData();
        return data.glyph as string;
    }

    /**
     * Fills the spatial structure full of values based off the passed Vector2, WorldObject map.
     */
    private fillGrid(map: Map<Vector2, WorldObject>): void {
        this.buckets.clear();
        this.positionToBucketKey.clear();

        for (const [pos, obj] of map) {
            this.insert(pos, this.parseWorldObject(obj));
        }
    }
}
