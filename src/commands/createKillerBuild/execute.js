// src/commands/createKillerBuild/execute.js
import { SlashCommandBuilder }    from '@discordjs/builders';
import path                       from 'path';
import { fileURLToPath }          from 'url';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { drawBuildOverview }      from '../../utils/drawUtils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// 1) Named Export für die Slash-Command-Definition
export const data = new SlashCommandBuilder()
  .setName('createkillerbuild')
  .setDescription('Erstellt eine Dead-by-Daylight Killer-Build-Grafik');

// 2) Named Export für die Ausführung
export async function execute(interaction) {
  try {
    // Build-Name + Perk-Namen
    const buildName = 'Dr. Franks Blutbad';
    const perkNames = ['Spürsinn','Gejagt','Jägerinstinkt','Todesklingen'];

    // Absolute Pfade zu den Assets
    const killerPath = path.join(__dirname, '../../assets/killer.png');
    const killerImage = await loadImage(killerPath);

    const perkFiles = ['perk1.png','perk2.png','perk3.png','perk4.png'];
    const perkImages = await Promise.all(
      perkFiles.map(f =>
        loadImage(path.join(__dirname, '../../assets', f))
      )
    );

    // Canvas erstellen
    const width  = 800;
    const height = 600;
    const canvas = createCanvas(width, height);
    const ctx    = canvas.getContext('2d');

    // Grafik zeichnen
    drawBuildOverview(ctx, {
      width,
      height,
      killerImage,
      buildName,
      perkImages,
      perkNames
    });

    // Ausgabe als PNG-Datei
    const buffer = canvas.toBuffer('image/png');
    await interaction.reply({
      files: [{ attachment: buffer, name: 'killer-build.png' }],
      ephemeral: true
    });

  } catch (err) {
    console.error('createKillerBuild-Error:', err);
    if (!interaction.replied) {
      await interaction.reply({
        content: 'Oops, da ist was schiefgelaufen.',
        ephemeral: true
      });
    }
  }
}
