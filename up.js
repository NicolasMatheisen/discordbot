const { Client, GatewayIntentBits } = require('discord.js');
const fetch = require('node-fetch');
const dotenv = require('dotenv');

dotenv.config();

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});

client.once('ready', async () => {
	console.log(`Logged in as ${client.user.tag}!`);

	const botToken = process.env.DISCORD_TOKEN;
	const imageUrl = 'https://cdn.discordapp.com/emojis/1269676059511488626.webp?size=256';

	try {
		const response = await fetch(imageUrl);
		const buffer = await response.buffer();
		const base64Image = buffer.toString('base64');

		await fetch('https://discord.com/api/v10/users/@me', {
			method: 'PATCH',
			headers: {
				'Authorization': `Bot ${botToken}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				avatar: `data:image/png;base64,${base64Image}`,
			}),
		});

		console.log('Profile picture updated successfully!');
	}
	catch (error) {
		console.error('Error updating profile picture:', error);
	}
});

client.login(process.env.DISCORD_TOKEN);
