const dotenv = require('dotenv');
const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

// Lade die .env-Datei
dotenv.config();

const { CLIENT_ID, DISCORD_TOKEN } = process.env;

const commands = [];
const commandsPath = path.join(process.cwd(), 'commands');

if (!fs.existsSync(commandsPath)) {
    console.error(`[ERROR] Der Ordner ${commandsPath} existiert nicht.`);
    process.exit(1);
}

// Alle Command-Dateien im "commands/"-Ordner finden
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

console.log(`Gefundene Befehlsdateien:`, commandFiles);

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    try {
        const command = require(filePath);
        console.log(`Importierte Datei: ${filePath}`, command);

        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        } else {
            console.warn(`[WARNING] Die Datei ${filePath} fehlt entweder "data" oder "execute".`);
        }
    } catch (error) {
        console.error(`[ERROR] Fehler beim Laden von ${filePath}:`, error);
    }
}

console.log(`Commands geladen:`, commands);

const rest = new REST().setToken(DISCORD_TOKEN);

(async () => {
    try {
        console.log(`Starte Aktualisierung von ${commands.length} globalen Slash-Commands.`);

        const data = await rest.put(
            Routes.applicationCommands(CLIENT_ID), // Für globale Commands
            { body: commands },
        );

        console.log(`Erfolgreich ${data.length} globale Slash-Commands aktualisiert.`);
    } catch (error) {
        console.error(`[ERROR] Fehler beim Aktualisieren der Slash-Commands:`, error);
    }
})();
