const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { User, Inventory, InventoryItem } = require('../database/models');
const itemEmojis = require('../utils/itemEmojis');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('inventar')
		.setDescription('Zeigt dein Inventar und deine Statistiken an.'),
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		console.log('Interaktion gestartet:', interaction.id);

		try {
			await interaction.deferReply({ ephemeral: true });

			const userId = interaction.user.id;
			console.log('Benutzer-ID:', userId);

			const user = await User.findOne({ where: { DiscordUserID: userId } });
			console.log('Benutzer gefunden:', user ? true : false);

			if (!user) {
				if (!interaction.replied && !interaction.deferred) {
					await interaction.reply('Du hast noch kein Konto. Bitte erkunde zuerst eine Welt.');
				}
				return;
			}

			const inventory = await Inventory.findOne({ where: { UserID: user.UserID } });
			console.log('Inventar gefunden:', inventory ? true : false);

			if (!inventory) {
				if (!interaction.replied && !interaction.deferred) {
					await interaction.reply('Du hast noch kein Inventar.');
				}
				return;
			}

			const inventoryItems = await InventoryItem.findAll({ where: { InventoryID: inventory.InventoryID } });
			const itemSummary = {};
			inventoryItems.forEach(item => {
				if (!itemSummary[item.ItemName]) {
					itemSummary[item.ItemName] = 0;
				}
				itemSummary[item.ItemName] += item.ItemQuantity;
			});

			const formattedBalance = inventory.CurrentBalance.toLocaleString();
			const embed = new EmbedBuilder()
				.setTitle(`${interaction.user.username}'s Inventar`)
				.setColor('#0a03c0')
				.addFields(
					{ name: 'Kontostand', value: `\u27A5 ${formattedBalance} <:botcoins:1306850998119301130>`, inline: true },
					{ name: 'Items', value: Object.entries(itemSummary).map(([itemName, quantity]) => `\u27A5 ${itemEmojis[itemName] || ''} ${itemName}: ${quantity}`).join('\n') || 'Keine Items gefunden', inline: false },
				)
				.setTimestamp(interaction.createdTimestamp);

			await interaction.editReply({ embeds: [embed] });
			console.log('Antwort gesendet für Interaktion:', interaction.id);

		}
		catch (error) {
			console.error('Fehler beim Ausführen des Inventar-Befehls:', error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'Es gab einen Fehler bei der Ausführung dieses Befehls.', ephemeral: true });
			}
			else {
				await interaction.reply({ content: 'Es gab einen Fehler bei der Ausführung dieses Befehls.', ephemeral: true });
			}
		}
	},
};
