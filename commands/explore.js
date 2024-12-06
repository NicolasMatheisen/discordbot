const { SlashCommandBuilder } = require('discord.js');
const { handleExplore } = require('../services/exploreService');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('explore')
		.setDescription('Erkunde eine Welt und erhalte eine Belohnung!')
		.addStringOption(option =>
			option.setName('welt')
				.setDescription('Die Welt, die du erkunden möchtest')
				.setRequired(true)
				.addChoices(
					{ name: 'Urwald', value: 'Urwald' },
					{ name: 'Drachenhöhle', value: 'Drachenhöhle' },
					{ name: 'Meerjungfrauen-Lagune', value: 'Meerjungfrauen-Lagune' },
					{ name: 'Kristallhöhle', value: 'Kristallhöhle' },
					{ name: 'Wüste', value: 'Wüste' },
				)),
	async execute(interaction) {
		const selectedWorldName = interaction.options.getString('welt');
		const discordUserID = interaction.user.id;

		try {
			const rewards = await handleExplore(selectedWorldName, discordUserID);
			await handleSuccess(interaction, selectedWorldName, rewards);
		} catch (error) {
			await handleError(interaction, error);
		}
	},
};

async function handleSuccess(interaction, selectedWorldName, rewards) {
	const foundItemsList = rewards.join(', ');
	await interaction.reply(`Du hast folgende Gegenstände in der ${selectedWorldName} gefunden: ${foundItemsList}!`);
}

async function handleError(interaction, error) {
	console.error('Fehler beim Erkunden der Welt:', error);
	await interaction.reply('Es gab ein Problem beim Erkunden der Welt. Bitte versuche es später erneut.');
}
