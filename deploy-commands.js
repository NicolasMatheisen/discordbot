const { REST, Routes } = require('discord.js');
const dotenv = require('dotenv');
const fs = require('node:fs');
const path = require('node:path');

dotenv.config();

const commands = [];
// Grab all the command folders from the commands directory you created earlier
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	if ('data' in command && 'execute' in command) {
		commands.push(command.data.toJSON());
	}
	else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

// Deploy your commands to each guild
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const guildIds = process.env.GUILD_IDS.split(',');

		for (const guildId of guildIds) {
			const data = await rest.put(
				Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId.trim()),
				{ body: commands },
			);
			console.log(`Successfully reloaded ${data.length} application (/) commands for guild ID ${guildId.trim()}.`);
		}
	}
	catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
