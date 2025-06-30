// deploy-commands.mjs
import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import fs               from 'node:fs/promises';
import path             from 'node:path';
import { pathToFileURL } from 'url';

const { CLIENT_ID, DISCORD_TOKEN } = process.env;
if (!CLIENT_ID || !DISCORD_TOKEN) {
  console.error('[ERROR] CLIENT_ID oder DISCORD_TOKEN fehlt in .env');
  process.exit(1);
}

// Wo deine Commands liegen
const commandsRoot = path.join(process.cwd(), 'commands');

const folders = await fs
  .readdir(commandsRoot, { withFileTypes: true })
  .then(dirents => dirents.filter(d => d.isDirectory()).map(d => d.name));

const commands = [];
for (const folder of folders) {
  const indexPath = path.join(commandsRoot, folder, 'index.js');
  try {
    await fs.access(indexPath);
    const mod = await import(pathToFileURL(indexPath).href);
    const cmd = mod.default ?? mod;
    if (cmd.data?.toJSON) {
      commands.push(cmd.data.toJSON());
      console.log(`→ Loaded command: ${cmd.data.name}`);
    }
  } catch {
    /* überspringen */
  }
}

console.log(`Bereite Upload von ${commands.length} globalen Commands vor…`);

const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);
try {
  await rest.put(
    // ACHTUNG: applicationCommands = global
    Routes.applicationCommands(CLIENT_ID),
    { body: commands }
  );
  console.log(`✅ ${commands.length} Commands global registriert.`);
} catch (err) {
  console.error('[ERROR] Global-Upload fehlgeschlagen:', err);
  process.exit(1);
}
