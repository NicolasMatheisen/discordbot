const { SlashCommandBuilder } = require('discord.js');
const { generateShopEmbed } = require('../services/shopService');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shop')
		.setDescription('Zeigt den aktuellen Shop an'),
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		try {
			const { embed, row } = generateShopEmbed();
			await postShop(interaction, embed, row);
		} catch (error) {
			await handleError(interaction, error);
		}
	},
};

async function postShop(interaction, embed, row) {
	const shopChannelId = process.env.SHOP_CHANNEL_ID;
	const channel = interaction.client.channels.cache.get(shopChannelId);

	if (channel && channel.isTextBased()) {
		await channel.send({ embeds: [embed], components: [row] });
		await interaction.reply({ content: 'Der Shop wurde aktualisiert und gepostet!', ephemeral: true });
	} else {
		await interaction.reply({ content: 'Der Shop-Kanal ist nicht vorhanden oder ist kein Textkanal.', ephemeral: true });
	}
}

async function handleError(interaction, error) {
	console.error('Fehler beim Ausführen des Shop-Befehls:', error);
	const errorMessage = 'Es gab ein Problem beim Anzeigen des Shops. Bitte versuche es später erneut.';
	if (interaction.replied || interaction.deferred) {
		await interaction.followUp({ content: errorMessage, ephemeral: true });
	} else {
		await interaction.reply({ content: errorMessage, ephemeral: true });
	}
}
