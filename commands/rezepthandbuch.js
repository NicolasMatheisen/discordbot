const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { loadAttachment, getPaginationRow } = require('../services/rezepthandbuchService');
const loadEmbeds = require('../utils/embedLoader');
const embedsPath = '/home/discordbot/embeds';
const embeds = loadEmbeds(embedsPath);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rezepthandbuch')
		.setDescription('Displays a paginated book'),
	async execute(interaction) {
		let currentPage = 0;

		const embed = new EmbedBuilder(embeds[currentPage]);
		const attachment = await loadAttachment(embed);

		const embedMessage = await interaction.reply({ embeds: [embed], components: [getPaginationRow(currentPage, embeds.length)], files: [attachment], fetchReply: true });

		const filter = i => i.user.id === interaction.user.id;
		const collector = embedMessage.createMessageComponentCollector({ filter, time: 60000 });

		collector.on('collect', async i => handleCollect(i, currentPage));
		collector.on('end', () => handleEnd(embedMessage, currentPage));
	},
};

async function handleCollect(interaction, currentPage) {
	if (interaction.customId === 'prev') {
		currentPage--;
	} else if (interaction.customId === 'next') {
		currentPage++;
	}

	const newEmbed = new EmbedBuilder(embeds[currentPage]);
	const newAttachment = await loadAttachment(newEmbed);

	await interaction.update({
		embeds: [newEmbed],
		components: [getPaginationRow(currentPage, embeds.length)],
		files: [newAttachment],
	});
}

function handleEnd(embedMessage, currentPage) {
	getPaginationRow(currentPage, embeds.length).components.forEach(button => button.setDisabled(true));
	embedMessage.edit({ components: [getPaginationRow(currentPage, embeds.length)] });
}
