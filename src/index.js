// src/index.js
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'url';
import { Client, Collection, GatewayIntentBits } from 'discord.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// 1) Commands laden
const commandsPath = path.join(__dirname, 'commands');
const commandDirs  = fs
  .readdirSync(commandsPath)
  .filter(name => fs.statSync(path.join(commandsPath, name)).isDirectory());

for (const dir of commandDirs) {
  const filePath = path.join(commandsPath, dir, 'index.js');
  const module   = await import(pathToFileURL(filePath).href);
  // Variante 2: nutze default falls vorhanden, sonst das Modul selbst
  const command  = module.default ?? module;

  if (command?.data && command?.execute) {
    client.commands.set(command.data.name, command);
  } else {
    console.warn(`[WARNING] ${dir} exportiert kein { data, execute }`);
  }
}

// 2) Events laden
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(f => f.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const { name, once = false, execute } = await import(pathToFileURL(filePath).href);

  if (once)  client.once(name, (...args) => execute(client, ...args));
  else       client.on(name,   (...args) => execute(client, ...args));
}

client.login(process.env.DISCORD_TOKEN);
