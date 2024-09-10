import * as path from 'path';
import * as fs from 'fs';

// Define the path to your JSON file
const filePath = path.join(process.cwd(), 'backend_state.json');

// Step 1: Read the JSON file
export function readState(): any {
  const fileData = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileData);
}

// Step 3: Write the modified JSON back to the file
export function writeState(state: any): void {
  const jsonString = JSON.stringify(state, null, 2); // Format JSON with 2 spaces indentation
  fs.writeFileSync(filePath, jsonString, 'utf8');
}
