const { User, Inventory, InventoryItem } = require('../database/models');

async function getUserByDiscordID(discordUserID) {
	return await User.findOne({ where: { DiscordUserID: discordUserID } });
}

async function getInventoryByUserID(userID) {
	return await Inventory.findOne({ where: { UserID: userID } });
}

async function getInventoryItemsByInventoryID(inventoryID) {
	return await InventoryItem.findAll({ where: { InventoryID: inventoryID } });
}

function summarizeItems(inventoryItems) {
	const itemSummary = {};
	inventoryItems.forEach(item => {
		if (!itemSummary[item.ItemName]) {
			itemSummary[item.ItemName] = 0;
		}
		itemSummary[item.ItemName] += item.ItemQuantity;
	});
	return itemSummary;
}

module.exports = { getUserByDiscordID, getInventoryByUserID, getInventoryItemsByInventoryID, summarizeItems };
