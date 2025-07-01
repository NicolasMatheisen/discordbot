// src/utils/fontSetup.js
import { GlobalFonts } from '@napi-rs/canvas';
import path               from 'path';
import { fileURLToPath }  from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Pfad zur Font-Datei
const fontPath = path.join(__dirname, '../assets/fonts/GillSansMedium.otf');

// Font registrieren und unter dem Namen 'GillSansMedium' verwenden
GlobalFonts.registerFromPath(fontPath, 'GillSansMedium');
