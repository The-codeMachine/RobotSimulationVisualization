/**
 * Gets the content of a file at a specific path. 
 * 
 * @param filePath 
 * @returns the content of the file at a path or nothing if file does not exist
 */
export async function loadFile(filePath: string): Promise<string> {
    return "not implemented";
}

/**
 * Writes content to a file at filePath. 
 * 
 * @param filePath 
 * @param content 
 * @returns true if the write was successful and false otherweise
 */
export async function writeFile(filePath: string, content: string): Promise<boolean> {
    return false;
}