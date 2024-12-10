const fs = require('fs');
const path = require('path');
const { AttachmentBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');

async function loadAttachment(embed) {
	const attachmentPath = path.join('/home/discordbot/sprites', embed.data.thumbnail.url.split('/').pop());
	return new Promise((resolve, reject) => {
		fs.readFile(attachmentPath, (err) => {
			if (err) {
				reject(err);
			}
			else {
				const attachment = new AttachmentBuilder(attachmentPath, { name: embed.data.thumbnail.url.split('/').pop() });
				embed.setThumbnail(`attachment://${attachment.name}`);
				resolve(attachment);
			}
		});
	});
}

function getPaginationRow(currentPage, totalPages) {
	return new ActionRowBuilder()
		.addComponents(
			new ButtonBuilder()
				.setCustomId('prev')
				.setLabel('◀️')
				.setStyle('Primary')
				.setDisabled(currentPage === 0),
			new ButtonBuilder()
				.setCustomId('current')
				.setLabel(`Seite ${currentPage + 1}/${totalPages}`)
				.setStyle('Secondary')
				.setDisabled(true),
			new ButtonBuilder()
				.setCustomId('next')
				.setLabel('▶️')
				.setStyle('Primary')
				.setDisabled(currentPage === totalPages - 1),
		);
}

module.exports = { loadAttachment, getPaginationRow };
