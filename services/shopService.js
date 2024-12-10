const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const itemEmojis = require('../utils/itemEmojis');

const items = [
	{ name: 'Magiepilz', cost: 1000 },
	{ name: 'Wasser', cost: 1200 },
	{ name: 'Drachenblut', cost: 1500 },
	{ name: 'Skarabäus', cost: 1700 },
	{ name: 'Trollpopel', cost: 300 },
	{ name: 'Seerose', cost: 400 },
	{ name: 'Drachenauge', cost: 500 },
	{ name: 'Giftling', cost: 600 },
	{ name: 'Nachtgewächs', cost: 700 },
	{ name: 'Tau', cost: 800 },
	{ name: 'Knochen', cost: 900 },
];

let nextUpdate = Math.floor((Date.now() + 8 * 60 * 60 * 1000) / 1000);
let currentShopItems = [];

function getRandomItems(count) {
	const shuffled = items.sort(() => 0.5 - Math.random());
	return shuffled.slice(0, count);
}

function generateShopEmbed() {
	currentShopItems = getRandomItems(3);
	const options = currentShopItems.map(item => ({
		label: item.name,
		description: `Kosten: ${item.cost} Coins`,
		value: item.name,
		emoji: itemEmojis[item.name],
	}));

	options.push(...[
		{
			label: 'Brau-Slot 1',
			description: 'Kosten: 2000 Coins',
			value: 'brew_slot_1',
		},
		{
			label: 'Brau-Slot 2',
			description: 'Kosten: 4000 Coins',
			value: 'brew_slot_2',
		},
		{
			label: 'Brau-Slot 3',
			description: 'Kosten: 6000 Coins',
			value: 'brew_slot_3',
		},
		{
			label: 'Brau-Slot 4',
			description: 'Kosten: 8000 Coins',
			value: 'brew_slot_4',
		},
	]);

	const embed = new EmbedBuilder()
		.setColor('#ffd700')
		.setTitle('Willkommen im Shop!')
		.setDescription(`Alle 8 Stunden gibt es neue Angebote! \nNächstes Update: <t:${nextUpdate}:R>`)
		.addFields(
			{ name: 'Aktuelle Angebote', value: currentShopItems.map(item => `${itemEmojis[item.name]} ${item.name} - ${item.cost} Coins`).join('\n') },
			{ name: 'Brau-Slots', value: '1. Brau-Slot: 2000 Coins\n2. Brau-Slot: 4000 Coins\n3. Brau-Slot: 6000 Coins\n4. Brau-Slot: 8000 Coins' },
		)
		.setTimestamp();

	const row = new ActionRowBuilder()
		.addComponents(
			new StringSelectMenuBuilder()
				.setCustomId('select')
				.setPlaceholder('Wähle ein Item')
				.addOptions(options),
		);

	return { embed, row };
}


function updateShop(client) {
	nextUpdate = Math.floor((Date.now() + 8 * 60 * 60 * 1000) / 1000);
	const { embed, row } = generateShopEmbed();

	client.guilds.cache.forEach(async guild => {
		const channels = guild.channels.cache.filter(channel => channel.isTextBased());
		for (const channel of channels.values()) {
			try {
				await channel.send({ embeds: [embed], components: [row] });
			}
			catch (error) {
				console.error('Error sending shop update:', error);
			}
		}
	});
}

module.exports = { generateShopEmbed, updateShop };
