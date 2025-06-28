import fs from 'node:fs';


export function ensureUnique(arr) {
  return new Set(arr).size === arr.length;
}

export function guardExists(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Datei nicht gefunden: ${filePath}`);
  }
}
