const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const dotenv = require('dotenv');
const { sequelize } = require('./database/models');


dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	}
	else {
		console.log(`[WARNING] Der Befehl in ${filePath} fehlt eine erforderliche "data" oder "execute" Eigenschaft.`);
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

const guildIds = process.env.GUILD_IDS.split(',');

client.once('ready', async () => {
	console.log(`Logged in as ${client.user.tag}!`);

	await sequelize.sync({ alter: false });
	console.log('Datenbank und Tabellen sind synchronisiert.');

	guildIds.forEach(guildId => {
		const guild = client.guilds.cache.get(guildId.trim());
		if (guild) {
			console.log(`Bot is active in guild: ${guild.name}`);
		}
		else {
			console.log(`Bot is not in guild with ID: ${guildId}`);
		}
	});
});


client.on('interactionCreate', async interaction => {
	try {
		if (!interaction.isCommand()) return;

		const command = client.commands.get(interaction.commandName);

		if (!command) {
			console.log(`Unbekannter Befehl: ${interaction.commandName}`);
			return;
		}

		console.log(`Befehl ${interaction.commandName} wird ausgeführt...`);

		await command.execute(interaction);
		console.log(`Befehl ${interaction.commandName} erfolgreich ausgeführt.`);
	}
	catch (error) {
		console.error('Fehler beim Ausführen der Interaktion:', error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'Es gab einen Fehler bei der Ausführung dieses Befehls.', ephemeral: true });
		}
		else {
			await interaction.reply({ content: 'Es gab einen Fehler bei der Ausführung dieses Befehls.', ephemeral: true });
		}
	}
});

client.login(process.env.DISCORD_TOKEN);
