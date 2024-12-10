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

			const shopChannelId = process.env.SHOP_CHANNEL_ID;
			const channel = interaction.client.channels.cache.get(shopChannelId);

			if (channel && channel.isTextBased()) {
				await channel.send({ embeds: [embed], components: [row] });
				await interaction.reply({ content: 'Der Shop wurde aktualisiert und gepostet!', ephemeral: true });
			}
			else {
				await interaction.reply({ content: 'Der Shop-Kanal ist nicht vorhanden oder ist kein Textkanal.', ephemeral: true });
			}
		}
		catch (error) {
			console.error('Fehler beim Ausführen des Shop-Befehls:', error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'Es gab ein Problem beim Anzeigen des Shops. Bitte versuche es später erneut.', ephemeral: true });
			}
			else {
				await interaction.reply({ content: 'Es gab ein Problem beim Anzeigen des Shops. Bitte versuche es später erneut.', ephemeral: true });
			}
		}
	},
};
