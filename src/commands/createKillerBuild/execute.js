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

  // Perks
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

  // Addons (optional)
  .addStringOption(opt =>
    opt.setName('addon1')
       .setDescription('Addon 1 (optional)')
       .setRequired(false)
       .setAutocomplete(true)
  )
  .addStringOption(opt =>
    opt.setName('addon2')
       .setDescription('Addon 2 (optional)')
       .setRequired(false)
       .setAutocomplete(true)
  )

  // Offering (optional)
  .addStringOption(opt =>
    opt.setName('offering')
       .setDescription('Optional: Offering')
       .setRequired(false)
       .setAutocomplete(true)
  );

export async function execute(interaction) {
  try {
    // Eingaben auslesen
    const killer     = interaction.options.getString('killer');
    const perkNames  = [
      interaction.options.getString('perk1'),
      interaction.options.getString('perk2'),
      interaction.options.getString('perk3'),
      interaction.options.getString('perk4'),
    ];
    const addonNames = [
      interaction.options.getString('addon1'),
      interaction.options.getString('addon2'),
    ].filter(Boolean);
    const offering   = interaction.options.getString('offering'); // null, wenn none

    // Bilder laden
    const killerPath = path.join(__dirname, '../../assets/killericons', `${killer}.png`);
    const killerImage = await loadImage(killerPath);

    const perkImages = await Promise.all(
      perkNames.map(name => {
        const p = path.join(__dirname, '../../assets/killerperks', `${name}.png`);
        return loadImage(p);
      })
    );

    const addonImages = await Promise.all(
      addonNames.map(name => {
        const a = path.join(__dirname, '../../assets/killeraddons', `${name}.png`);
        return loadImage(a);
      })
    );

    let offeringImage = null;
    if (offering) {
      const op = path.join(__dirname, '../../assets/killerofferings', `${offering}.png`);
      offeringImage = await loadImage(op);
    }

    // Canvas erstellen
    const width  = 1080;
    const height = offeringImage ? 1920 : 1920;
    const canvas = createCanvas(width, height);
    const ctx    = canvas.getContext('2d');

    // Zeichnen (angepasstes drawBuildOverview)
    drawBuildOverview(ctx, {
      width,
      height,
      killerImage,
      buildName: killer,
      perkImages,
      perkNames,
      addonImages,
      addonNames,
      offeringImage,
      offeringName: offering
    });

    // Antwort senden
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
