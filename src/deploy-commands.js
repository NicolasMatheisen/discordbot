// deploy-commands.mjs
import 'dotenv/config'
import { REST, Routes } from 'discord.js'
import fs from 'node:fs/promises'
import path from 'node:path'

const { CLIENT_ID, DISCORD_TOKEN } = process.env
const commandsRoot = path.join(process.cwd(), 'commands')

// Schritt 1: Einlesen aller Command-Unterordner
let folders = []
try {
  folders = await fs.readdir(commandsRoot, { withFileTypes: true })
    .then(dirents => dirents.filter(d => d.isDirectory()).map(d => d.name))
} catch {
  console.error('[ERROR] Konnte commands-Root nicht lesen:', commandsRoot)
  process.exit(1)
}

const commands = []

// Schritt 2: Pro Ordner nur index.js importieren
for (const folder of folders) {
  const indexPath = path.join(commandsRoot, folder, 'index.js')

  try {
    // Prüfen, ob index.js existiert
    await fs.access(indexPath)

    const { data } = await import(indexPath)
    if (data?.toJSON) {
      commands.push(data.toJSON())
      console.log(`→ Loaded command from ${folder}/index.js`)
    } else {
      console.warn(`[WARN] ${folder}/index.js exportiert kein data.toJSON()`)
    }
  } catch {
    console.warn(`[WARN] Kein index.js in ${folder}, übersprungen`)
  }
}

console.log(`Bereite Upload von ${commands.length} eindeutigen Commands vor…`)

// Schritt 3: Upload via REST
const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN)

try {
  const result = await rest.put(
    Routes.applicationCommands(CLIENT_ID),
    { body: commands }
  )
  console.log(`Erfolgreich ${result.length} globale Slash-Commands registriert.`)
} catch (err) {
  console.error('[ERROR] Upload fehlgeschlagen:', err)
  process.exit(1)
}
