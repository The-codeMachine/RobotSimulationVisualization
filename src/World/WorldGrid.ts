
import { stringToVector2, type Vector2 } from "../lib/position/Vector2.js";
import type { WorldObject } from "./WorldObject.js";

interface GridEntry {
    pos: Vector2;
    value: WorldObject;
}

export class WorldGrid {
    /**
     * Spatial buckets containing objects whose AABBs overlap
     * the corresponding bucket.
     */
    private readonly buckets = new Map<string, GridEntry[]>();

    /**
     * Tracks every bucket occupied by each object position.
     */
    private readonly positionToBucketKeys = new Map<Vector2, string[]>();

    /**
     * Determines the spatial cell width and height.
     */
    private readonly cellSize = 10;

    constructor(map: Map<string, WorldObject>) {
        this.fillGrid(map);
    }

    /**
     * Generates a unique key for a spatial bucket.
     *
     * String keys avoid the coordinate collisions possible
     * with the previous 16-bit integer packing.
     */
    private getBucketKey(x: number, y: number): string {
        const bx = Math.floor(x / this.cellSize);
        const by = Math.floor(y / this.cellSize);

        return `${bx},${by}`;
    }

    /**
     * Gets the world-space bounds of an object.
     *
     * Objects without colliders are treated as points.
     */
    private getBounds(obj: WorldObject, pos: Vector2) {
        const collider = obj.getCollider();

        if (!collider) {
            return {
                minX: pos.x,
                minY: pos.y,
                maxX: pos.x,
                maxY: pos.y
            };
        }

        return {
            minX: collider.data.minimum.x,
            minY: collider.data.minimum.y,
            maxX: collider.data.maximum.x,
            maxY: collider.data.maximum.y
        };
    }

    /**
     * Determines every spatial bucket overlapped by an object.
     */
    private getOccupiedBucketKeys(obj: WorldObject, pos: Vector2): string[] {
        const bounds = this.getBounds(obj, pos);

        const startX = Math.floor(bounds.minX / this.cellSize);
        const endX = Math.floor(bounds.maxX / this.cellSize);

        const startY = Math.floor(bounds.minY / this.cellSize);
        const endY = Math.floor(bounds.maxY / this.cellSize);

        const keys: string[] = [];

        for (let bx = startX; bx <= endX; bx++) {
            for (let by = startY; by <= endY; by++) {
                keys.push(this.getBucketKey(
                    bx * this.cellSize,
                    by * this.cellSize
                ));
            }
        }

        return keys;
    }

    /**
     * Inserts an object into every bucket its collider overlaps.
     */
    public insert(pos: Vector2, value: WorldObject): void {
        if (this.positionToBucketKeys.has(pos)) {
            throw new Error("Object position is already indexed.");
        }

        const entry: GridEntry = { pos, value };

        const keys = this.getOccupiedBucketKeys(value, pos);

        for (const key of keys) {
            let bucket = this.buckets.get(key);

            if (!bucket) {
                bucket = [];
                this.buckets.set(key, bucket);
            }

            bucket.push(entry);
        }

        this.positionToBucketKeys.set(pos, keys);
    }

    /**
     * Updates an existing object.
     *
     * Re-indexes it if its position or collider has changed.
     */
    public update(pos: Vector2, newValue?: WorldObject): void {
        const oldKeys = this.positionToBucketKeys.get(pos);

        if (!oldKeys) {
            if (newValue) {
                this.insert(pos, newValue);
            }

            return;
        }

        const oldBucket = this.buckets.get(oldKeys[0]);

        const entry = oldBucket?.find(item => item.pos === pos);

        if (!entry) {
            throw new Error("Grid index is inconsistent.");
        }

        const value = newValue ?? entry.value;

        this.delete(pos);
        this.insert(pos, value);
    }

    /**
     * Removes an object from all occupied spatial buckets.
     */
    public delete(pos: Vector2): boolean {
        const keys = this.positionToBucketKeys.get(pos);

        if (!keys) {
            return false;
        }

        for (const key of keys) {
            const bucket = this.buckets.get(key);

            if (!bucket) continue;

            const index = bucket.findIndex(
                item => item.pos === pos
            );

            if (index !== -1) {
                bucket.splice(index, 1);
            }

            if (bucket.length === 0) {
                this.buckets.delete(key);
            }
        }

        this.positionToBucketKeys.delete(pos);

        return true;
    }

    /**
     * Queries all objects whose AABBs overlap a rectangle.
     */
    public queryRectangle(min: Vector2, max: Vector2): GridEntry[] {
        if (!Number.isFinite(min.x) ||
            !Number.isFinite(min.y) ||
            !Number.isFinite(max.x) ||
            !Number.isFinite(max.y) ||
            min.x > max.x ||
            min.y > max.y
        ) {
            throw new RangeError("Invalid query rectangle.");
        }

        const results: GridEntry[] = [];
        const seen = new Set<GridEntry>();

        const startX = Math.floor(min.x / this.cellSize);
        const endX = Math.floor(max.x / this.cellSize);

        const startY = Math.floor(min.y / this.cellSize);
        const endY = Math.floor(max.y / this.cellSize);

        for (let bx = startX; bx <= endX; bx++) {
            for (let by = startY; by <= endY; by++) {
                const key = `${bx},${by}`;
                const bucket = this.buckets.get(key);

                if (!bucket) continue;

                for (const item of bucket) {
                    if (seen.has(item)) continue;

                    seen.add(item);

                    const bounds = this.getBounds(
                        item.value,
                        item.pos
                    );

                    // Actual AABB intersection test.
                    const overlaps =
                        bounds.maxX >= min.x &&
                        bounds.minX <= max.x &&
                        bounds.maxY >= min.y &&
                        bounds.minY <= max.y;

                    if (overlaps) {
                        results.push(item);
                    }
                }
            }
        }

        return results;
    }

    /**
     * Renders objects and their colliders inside a viewing rectangle.
     *
     * Each object gets an individual HTML element.
     * AABB colliders are rendered as transparent blue rectangles.
     *
     * @param a First corner of the viewing rectangle.
     * @param b Opposing corner of the viewing rectangle.
     * @param pixelsPerUnit Number of pixels per world unit.
     */
    public display(a: Vector2, b: Vector2, pixelsPerUnit: number = 20): HTMLDivElement {
        const minX = Math.min(a.x, b.x);
        const maxX = Math.max(a.x, b.x);
        const minY = Math.min(a.y, b.y);
        const maxY = Math.max(a.y, b.y);

        if (
            !Number.isFinite(minX) ||
            !Number.isFinite(maxX) ||
            !Number.isFinite(minY) ||
            !Number.isFinite(maxY) ||
            maxX <= minX ||
            maxY <= minY ||
            !Number.isFinite(pixelsPerUnit) ||
            pixelsPerUnit <= 0
        ) {
            throw new RangeError("Invalid display dimensions.");
        }

        const container = document.createElement("div");

        container.className = "spatial-grid";

        container.style.position = "relative";
        container.style.overflow = "hidden";
        container.style.boxSizing = "border-box";

        const width = (maxX - minX) * pixelsPerUnit;
        const height = (maxY - minY) * pixelsPerUnit;

        container.style.width = `${width}px`;
        container.style.height = `${height}px`;

        // Grid lines occur at integer world coordinates.
        const offsetX = ((-minX % 1) + 1) % 1 * pixelsPerUnit;
        const offsetY = ((-minY % 1) + 1) % 1 * pixelsPerUnit;

        container.style.backgroundColor = "#f8f8f8";

        container.style.backgroundImage = `
            linear-gradient(to right, #888 1px, transparent 1px),
            linear-gradient(to bottom, #888 1px, transparent 1px)
        `;

        container.style.backgroundSize = `${pixelsPerUnit}px ${pixelsPerUnit}px`;
        container.style.backgroundPosition = `${offsetX}px ${offsetY}px`;

        // Find all objects whose colliders overlap the viewing area.
        const objects = this.queryRectangle(
            { x: minX, y: minY },
            { x: maxX, y: maxY }
        );

        for (const item of objects) {
            const { pos, value } = item;

            const collider = value.getCollider();

            // Draw the AABB collider.
            if (collider) {
                const { minimum, maximum } = collider.data;

                const colliderElement = document.createElement("div");

                colliderElement.className = "spatial-grid-collider";

                colliderElement.style.position = "absolute";

                colliderElement.style.left = `${(minimum.x - minX) * pixelsPerUnit}px`;
                colliderElement.style.top = `${(minimum.y - minY) * pixelsPerUnit}px`;
                colliderElement.style.width = `${(maximum.x - minimum.x) * pixelsPerUnit}px`;
                colliderElement.style.height = `${(maximum.y - minimum.y) * pixelsPerUnit}px`;

                colliderElement.style.boxSizing = "border-box";

                // Transparent blue collider visualization.
                colliderElement.style.backgroundColor =
                    "rgba(0, 150, 255, 0.15)";

                colliderElement.style.border =
                    "2px solid rgba(0, 120, 255, 0.85)";

                colliderElement.style.zIndex = "1";

                colliderElement.style.pointerEvents = "none";

                container.appendChild(colliderElement);
            }

            // Draw the object's glyph above its collider.
            const glyph = value.getGlyph();

            if (glyph !== undefined) {
                const element = document.createElement("div");

                element.className = "spatial-grid-cell";

                element.textContent = glyph;

                element.style.position = "absolute";

                element.style.left =
                    `${(pos.x - minX) * pixelsPerUnit}px`;

                element.style.top =
                    `${(pos.y - minY) * pixelsPerUnit}px`;

                element.style.width = `${pixelsPerUnit}px`;
                element.style.height = `${pixelsPerUnit}px`;

                element.style.transform = "translate(-50%, -50%)";

                element.style.display = "flex";
                element.style.alignItems = "center";
                element.style.justifyContent = "center";

                element.style.fontSize = `${pixelsPerUnit * 0.8}px`;
                element.style.lineHeight = "1";

                element.style.zIndex = "2";

                element.style.pointerEvents = "none";
                element.style.userSelect = "none";

                container.appendChild(element);
            }
        }

        return container;
    }

    /**
     * Rebuilds the entire spatial grid from a WorldObject map.
     */
    private fillGrid(map: Map<string, WorldObject>): void {
        this.buckets.clear();
        this.positionToBucketKeys.clear();

        for (const [pos, obj] of map) {
            this.insert(stringToVector2(pos), obj);
        }
    }
}
