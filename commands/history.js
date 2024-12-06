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
			if (!user) return handleNoUser(interaction);

			const inventory = await getInventoryByUserID(user.UserID);
			if (!inventory) return handleNoInventory(interaction);

			const transactions = await getTransactionsByInventoryID(inventory.InventoryID);
			if (transactions.length === 0) return handleNoTransactions(interaction);

			await handleSuccess(interaction, transactions);
		} catch (error) {
			await handleError(interaction, error);
		}
	},
};

async function handleNoUser(interaction) {
	await interaction.reply('Du hast noch kein Konto. Bitte erkunde zuerst eine Welt.');
}

async function handleNoInventory(interaction) {
	await interaction.reply('Du hast noch kein Inventar.');
}

async function handleNoTransactions(interaction) {
	await interaction.reply('Keine Transaktionshistorie gefunden.');
}

async function handleSuccess(interaction, transactions) {
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

async function handleError(interaction, error) {
	console.error('Fehler beim Ausführen des /history Kommandos:', error);
	await interaction.reply('Es gab einen Fehler beim Abrufen deiner Transaktionshistorie. Bitte versuche es später erneut.');
}
