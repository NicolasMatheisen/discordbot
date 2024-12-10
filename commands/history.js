const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getUserByDiscordID, getInventoryByUserID, getTransactionsByInventoryID } = require('../services/historyService');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('history')
		.setDescription('Zeigt deine Transaktionshistorie an'),
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		const discordUserID = interaction.user.id;

		try {
			const user = await getUserByDiscordID(discordUserID);
			if (!user) {
				await interaction.reply('Du hast noch kein Konto. Bitte erkunde zuerst eine Welt.');
				return;
			}

			const inventory = await getInventoryByUserID(user.UserID);
			if (!inventory) {
				await interaction.reply('Du hast noch kein Inventar.');
				return;
			}

			const transactions = await getTransactionsByInventoryID(inventory.InventoryID);
			if (transactions.length === 0) {
				await interaction.reply('Keine Transaktionshistorie gefunden.');
				return;
			}

			const transactionDetails = transactions.map(transaction => {
				return `${transaction.CommandTimestamp.toISOString()} - ${transaction.Command}: ${transaction.BalanceChange > 0 ? '+' : ''}${transaction.BalanceChange} <:botcoins:1306850998119301130>`;
			}).join('\n');

			const embed = new EmbedBuilder()
				.setTitle(`Kontoauszug von ${interaction.user.username}`)
				.setColor('#00FF00')
				.setDescription(transactionDetails)
				.setTimestamp(new Date())
				.setFooter({ text: 'Dein persönlicher Kontoauszug', iconURL: 'https://example.com/icon.png' });

			await interaction.reply({ embeds: [embed] });
		}
		catch (error) {
			console.error('Fehler beim Ausführen des /history Kommandos:', error);
			await interaction.reply('Es gab einen Fehler beim Abrufen deiner Transaktionshistorie. Bitte versuche es später erneut.');
		}
	},
};
