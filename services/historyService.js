const { User, Inventory, AccountActivity } = require('../database/models');

async function getUserByDiscordID(discordUserID) {
	return await User.findOne({ where: { DiscordUserID: discordUserID } });
}

async function getInventoryByUserID(userID) {
	return await Inventory.findOne({ where: { UserID: userID } });
}

async function getTransactionsByInventoryID(inventoryID, limit = 10) {
	return await AccountActivity.findAll({
		where: { InventoryID: inventoryID },
		order: [['CommandTimestamp', 'DESC']],
		limit,
	});
}

module.exports = { getUserByDiscordID, getInventoryByUserID, getTransactionsByInventoryID };
