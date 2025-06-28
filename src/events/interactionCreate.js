import Discord from 'discord.js';
const { Events, InteractionResponseFlags } = Discord;

export const name = Events.InteractionCreate;
export const once = false;

export async function execute(client, interaction) {
  // Nur Slash-Commands und Autocomplete behandeln
  if (!interaction.isChatInputCommand() && !interaction.isAutocomplete()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) {
    console.error(`Kein Command gefunden für ${interaction.commandName}`);
    return;
  }

  try {
    if (interaction.isChatInputCommand()) {
      // Chat-Input-Command ausführen
      await command.execute(interaction);
    } else {
      // Autocomplete (falls implementiert)
      if (typeof command.autocomplete === 'function') {
        await command.autocomplete(interaction);
      } else {
        console.warn(`Autocomplete nicht implementiert für ${interaction.commandName}`);
      }
    }
  } catch (error) {
    console.error('Fehler beim Ausführen des Commands:', error);

    const replyPayload = {
      content: 'Beim Ausführen des Commands ist ein Fehler aufgetreten!',
      flags: InteractionResponseFlags.Ephemeral
    };

    if (interaction.replied || interaction.deferred) {
      // Wenn wir schon geantwortet haben, ein Follow-Up senden
      return interaction.followUp(replyPayload);
    }

    // Sonst ganz normal antworten
    return interaction.reply(replyPayload);
  }
}
