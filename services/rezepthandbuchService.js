const fs = require('fs');
const path = require('path');
const { AttachmentBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');

async function loadAttachment(embed) {
	const attachmentPath = getAttachmentPath(embed);
	return new Promise((resolve, reject) => {
		fs.readFile(attachmentPath, (err) => {
			if (err) {
				reject(err);
			} else {
				const attachment = createAttachment(attachmentPath, embed);
				resolve(attachment);
			}
		});
	});
}

function getAttachmentPath(embed) {
	return path.join('/home/discordbot/sprites', embed.data.thumbnail.url.split('/').pop());
}

function createAttachment(attachmentPath, embed) {
	const attachmentName = attachmentPath.split('/').pop();
	const attachment = new AttachmentBuilder(attachmentPath, { name: attachmentName });
	embed.setThumbnail(`attachment://${attachment.name}`);
	return attachment;
}

function getPaginationRow(currentPage, totalPages) {
	return new ActionRowBuilder()
		.addComponents(
			createButton('prev', '◀️', 'Primary', currentPage === 0),
			createButton('current', `Seite ${currentPage + 1}/${totalPages}`, 'Secondary', true),
			createButton('next', '▶️', 'Primary', currentPage === totalPages - 1),
		);
}

function createButton(customId, label, style, disabled) {
	return new ButtonBuilder()
		.setCustomId(customId)
		.setLabel(label)
		.setStyle(style)
		.setDisabled(disabled);
}

module.exports = { loadAttachment, getPaginationRow };
