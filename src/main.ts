import type { JsonObject } from "type-fest";
import { World } from "./World/World.js"; 
import { WorldGrid } from "./World/WorldGrid.js";

// Get the file input element from the DOM
const filePicker = document.getElementById("file-picker") as HTMLInputElement | null;

if (filePicker) {
    filePicker.addEventListener("change", async (event) => {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];

        if (!file) {
            return;
        }

        try {
            // Read the file contents as a text string asynchronously
            const fileText = await file.text();

            // Parse the text into a JavaScript object/value
            const rawData: unknown = JSON.parse(fileText);

            // Ensure the root of the parsed JSON is a valid JSON object
            if (isJsonObject(rawData)) {
                // Cast safely to type-fest's JsonObject
                const worldJson: JsonObject = rawData;

                // Instantiate your World class
                const world = new World(worldJson);
                const grid = new WorldGrid(world.getObjects());
                
                const worldEditor = document.getElementById("world-editor");
                const gridViewport = document.getElementById("grid-viewport");
                const options = document.getElementById("options");

                if (!worldEditor) {
                    throw new Error("Need a world editor HTML div element");
                }

                if (!gridViewport) {
                    throw new Error("Need a grid viewport HTML div element");
                }

                if (!options) {
                    throw new Error("Need an options HTML div element");
                }

                const display = grid.display({x: 0, y: 0}, {x: 100, y: 100}, 100, options);

                gridViewport.appendChild(display);

                console.log("World successfully loaded and parsed!", world);

                // You can now use world.getObjects() to render or process your world data
            } else {
                console.error("Invalid world file: Root JSON structure must be an object.");
            }
        } catch (error) {
            console.error("Failed to read or parse the selected JSON file:", error);
        }
    });
}

/**
 * Type guard helper to verify if an unknown parsed value is a JsonObject
 */
function isJsonObject(value: unknown): value is JsonObject {
    return (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
    );
}