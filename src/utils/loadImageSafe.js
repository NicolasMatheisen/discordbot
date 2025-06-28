import fs from 'node:fs';
import { loadImage } from '@napi-rs/canvas';


export async function loadImageSafe(filePath) {
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`Bild nicht gefunden: ${filePath}`);
  }


  try {
    const image = await loadImage(filePath);
    return image;
  } catch (err) {
    console.error(`Fehler beim Laden von Bild ${filePath}:`, err);
    throw new Error(`Fehler beim Laden des Bildes: ${filePath}`);
  }
}
