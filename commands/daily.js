const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { sequelize, AccountActivity } = require('../database/models');
const { getStartOfDay } = require('../utils/date');
const { getUserByDiscordID, createOrUpdateInventory, createAccountActivity, createOrUpdateInventoryItem } = require('../services/dailyService');
const coinGifs = [
	'https://media3.giphy.com/media/KA8NKtxyZFh72/giphy.gif?cid=6c09b952flsncj09o5ecvk0l3w0jqymctorjaxhnk3fcneqo&ep=v1_internal_gif_by_id&rid=giphy.gif&ct=g',
	'https://media2.giphy.com/media/GNvWw0pDL6QRW/giphy.gif?cid=6c09b952wwply3tvtvfzrqpaoclrpftzxaqzg6vtribh30zb&ep=v1_internal_gif_by_id&rid=giphy.gif&ct=g',
	'https://media0.giphy.com/media/xT1R9TaUQfgf5qQZEY/giphy.gif?cid=6c09b95286rkhb4csb91l2eltdb5hmr5dzv6hwyogmif2ydq&ep=v1_internal_gif_by_id&rid=giphy.gif&ct=g',
	'https://media3.giphy.com/media/xT1R9EICfQ229jdAKA/giphy.gif?cid=6c09b952kzosuv8hrtsvl9yewba7gxolop29znjebi3j89d5&ep=v1_internal_gif_by_id&rid=giphy.gif&ct=g',
	'https://media3.giphy.com/media/rszcYFb1jpNetUHsCf/giphy.gif?cid=6c09b9522vwn964foft2joi9d1gsxnt3v0939fv5xgbg5xi4&ep=v1_internal_gif_by_id&rid=giphy.gif&ct=g',
];
const randomGif = coinGifs[Math.floor(Math.random() * coinGifs.length)];

const embed = new EmbedBuilder()
	.setColor('#ffd700')
	.setTitle('🎉 Tägliche Belohnung 🎉')
	.setDescription('Du hast deine tägliche Belohnung erhalten!')
	.addFields({ name: 'Belohnungen', value: '\u27A5 100x <:botcoins:1306850998119301130>\n\u27A5 1x <:water:1308117196655820861> Wasser', inline: true })
	.setImage(randomGif)
	.setTimestamp()
	.setFooter({ text: 'Denke daran, deine täglichen Belohnungen einzusammeln!' });

module.exports = {
	data: new SlashCommandBuilder()
		.setName('daily')
		.setDescription('Sammle deine tägliche Belohnung ein!'),
	async execute(interaction) {
		if (!interaction.isCommand()) return;

		const now = new Date();
		const startOfDay = getStartOfDay(now);

		try {
			await sequelize.transaction(async (t) => {
				const user = await getUserByDiscordID(interaction.user.id);
				if (!user) return handleUserNotFound(interaction);

				const lastActivity = await getLastActivity(user.UserID, startOfDay, t);
				if (lastActivity) return handleAlreadyCollected(interaction, startOfDay);

				await processDailyReward(user.UserID, now, t);
				await interaction.reply({ embeds: [embed], ephemeral: true });
			});
		} catch (error) {
			console.error('Fehler beim Sammeln der täglichen Belohnung:', error);
			await interaction.reply({ content: 'Es gab ein Problem beim Sammeln deiner täglichen Münzen und des Wassers. Bitte versuche es später erneut.', ephemeral: true });
		}
	},
};

async function handleUserNotFound(interaction) {
	console.error(`Benutzer mit DiscordUserID ${interaction.user.id} nicht gefunden.`);
	await interaction.reply({ content: 'Es gab ein Problem beim Sammeln deiner täglichen Münzen und des Wassers. Bitte versuche es später erneut.', ephemeral: true });
}

async function getLastActivity(userID, startOfDay, transaction) {
	return await AccountActivity.findOne({
		where: { InventoryID: userID, Command: '/daily' },
		order: [['CommandTimestamp', 'DESC']],
		transaction,
	});
}

async function handleAlreadyCollected(interaction, startOfDay) {
	const nextAvailable = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
	await interaction.reply({ content: `Du hast deine tägliche Belohnung bereits gesammelt. Du kannst deine nächste Belohnung <t:${Math.floor(nextAvailable.getTime() / 1000)}:R> einsammeln.`, ephemeral: true });
}

async function processDailyReward(userID, now, transaction) {
	const inventory = await createOrUpdateInventory(userID, 100, transaction);
	await createAccountActivity(inventory.InventoryID, now, '/daily', 100, transaction);
	await createOrUpdateInventoryItem(inventory.InventoryID, 'Wasser', 1, transaction);
}
unga bunga lalalla