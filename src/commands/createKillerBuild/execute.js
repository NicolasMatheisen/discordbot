// src/commands/createKillerBuild/execute.js
import { SlashCommandBuilder } from '@discordjs/builders';
import path                    from 'path';
import { fileURLToPath }       from 'url';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { drawBuildOverview }   from '../../utils/drawUtils.js';



// JSON-Daten für Autocomplete
import killers   from '../../data/killers.json'   assert { type: 'json' };
import perks     from '../../data/perks.json'     assert { type: 'json' };
import addons    from '../../data/addons.json'    assert { type: 'json' };
import offerings from '../../data/offerings.json' assert { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// 1) Slash-Command-Definition mit Autocomplete
export const data = new SlashCommandBuilder()
  .setName('createkillerbuild')
  .setDescription('Erstellt eine Dead-by-Daylight Killer-Build-Grafik')
  .addStringOption(opt =>
    opt.setName('perkbuild_name')
       .setDescription('Wähle einen Namen für deinen Build')
       .setRequired(true)
  )
  .addStringOption(opt =>
    opt.setName('killer')
       .setDescription('Wähle deinen Killer')
       .setRequired(true)
       .setAutocomplete(true)
  )
  .addStringOption(opt =>
    opt.setName('perk1')
       .setDescription('Perk 1')
       .setRequired(true)
       .setAutocomplete(true)
  )
  .addStringOption(opt =>
    opt.setName('perk2')
       .setDescription('Perk 2')
       .setRequired(true)
       .setAutocomplete(true)
  )
  .addStringOption(opt =>
    opt.setName('perk3')
       .setDescription('Perk 3')
       .setRequired(true)
       .setAutocomplete(true)
  )
  .addStringOption(opt =>
    opt.setName('perk4')
       .setDescription('Perk 4')
       .setRequired(true)
       .setAutocomplete(true)
  )
  .addStringOption(opt =>
    opt.setName('offering')
       .setDescription('Optional: Offering')
       .setRequired(false)
       .setAutocomplete(true)
  );

// 2) Execution-Handler
export async function execute(interaction) {
  try {
    // Eingaben auslesen
    const killer    = interaction.options.getString('killer');
    const perkNames = [
      interaction.options.getString('perk1'),
      interaction.options.getString('perk2'),
      interaction.options.getString('perk3'),
      interaction.options.getString('perk4'),
    ];
    const offering  = interaction.options.getString('offering'); // null, wenn none

    // 2.1) Bilder laden – direkt mit Dateipfaden
    const killerPath = path.join(__dirname, '../../assets/killericons', `${killer}.png`);
    const killerImage = await loadImage(killerPath);

    const perkImages = await Promise.all(
      perkNames.map(name => {
        const p = path.join(__dirname, '../../assets/killerperks', `${name}.png`);
        return loadImage(p);
      })
    );

    let offeringImage = null;
    if (offering) {
      const op = path.join(__dirname, '../../assets/killerofferings', `${offering}.png`);
      offeringImage = await loadImage(op);
    }

    // 2.2) Canvas & Zeichnen
    const width  = 800;
    const height = offeringImage ? 700 : 600;
    const canvas = createCanvas(width, height);
    const ctx    = canvas.getContext('2d');

    drawBuildOverview(ctx, {
      width,
      height,
      killerImage,
      buildName: killer,
      perkImages,
      perkNames,
      offeringImage,
      offeringName: offering
    });

    // 2.3) Antwort senden – mit flags statt deprecated ephemeral
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
