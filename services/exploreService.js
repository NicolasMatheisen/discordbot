const { User, Inventory, InventoryItem } = require('../database/models');
const shuffle = require('../utils/shuffle');

class World {
	constructor(name, common, rare) {
		this.name = name;
		this.common = common;
		this.rare = rare;
		this.array = this.generateArray(common, rare);
		this.currentIndex = 0;
	}

	generateArray(common, rare) {
		return shuffle(Array.from({ length: 14 }, (_, index) => {
			if (index <= 4) return common;
			if (index <= 8) return common;
			if (index <= 10) return common;
			if (index === 11) return rare;
			if (index === 12) return `${rare} + ${common}`;
			if (index === 13) return `${rare} + ${common}`;
			return '';
		}));
	}

	explore() {
		const drop = this.array[this.currentIndex];
		this.currentIndex = (this.currentIndex + 1) % this.array.length;
		return drop.split('+').map(item => item.trim()).filter(item => item);
	}
}

async function handleExplore(selectedWorldName, discordUserID) {
	const worlds = getWorlds();
	const selectedWorld = worlds.find(world => world.name === selectedWorldName);
	const currentWorld = new World(selectedWorld.name, selectedWorld.common, selectedWorld.rare);
	const rewards = currentWorld.explore();

	const user = await findOrCreateUser(discordUserID);
	const inventory = await findOrCreateInventory(user.UserID);

	await updateInventoryItems(inventory.InventoryID, rewards);

	return rewards;
}

function getWorlds() {
	return [
		{ name: 'Urwald', common: 'Trollpopel', rare: 'Giftling' },
		{ name: 'Drachenhöhle', common: 'Drachenblut', rare: 'Drachenauge' },
		{ name: 'Meerjungfrauen-Lagune', common: 'Seerose', rare: 'Tau' },
		{ name: 'Kristallhöhle', common: 'Magiepilz', rare: 'Nachtgewächs' },
		{ name: 'Wüste', common: 'Skarabäus', rare: 'Knochen' },
	];
}

async function findOrCreateUser(discordUserID) {
	const [user] = await User.findOrCreate({
		where: { DiscordUserID: discordUserID },
		defaults: { DiscordUserID: discordUserID },
	});
	return user;
}

async function findOrCreateInventory(userID) {
	const [inventory] = await Inventory.findOrCreate({
		where: { UserID: userID },
		defaults: { UserID: userID, CurrentBalance: 0 },
	});
	return inventory;
}

async function updateInventoryItems(inventoryID, rewards) {
	for (const reward of rewards) {
		const [item, itemCreated] = await InventoryItem.findOrCreate({
			where: { InventoryID: inventoryID, ItemName: reward },
			defaults: { InventoryID: inventoryID, ItemName: reward, ItemQuantity: 1 },
		});

		if (!itemCreated) {
			item.ItemQuantity += 1;
			await item.save();
		}
	}
}

module.exports = { handleExplore };
