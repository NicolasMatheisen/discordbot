const { User, Inventory, AccountActivity, InventoryItem } = require('../database/models');

async function getUserByDiscordID(discordUserID) {
	return await User.findOne({ where: { DiscordUserID: discordUserID } });
}

async function getInventoryByUserID(userID) {
	return await Inventory.findOne({ where: { UserID: userID } });
}

async function createOrUpdateInventory(userID, balanceChange, transaction) {
	let inventory = await Inventory.findOne({ where: { UserID: userID }, transaction });
	if (!inventory) {
		inventory = await Inventory.create({ UserID: userID, CurrentBalance: balanceChange }, { transaction });
	}
	else {
		inventory.CurrentBalance += balanceChange;
		await inventory.save({ transaction });
	}
	return inventory;
}

async function createAccountActivity(inventoryID, now, command, balanceChange, transaction) {
	return await AccountActivity.create({
		InventoryID: inventoryID,
		CommandTimestamp: now,
		Command: command,
		BalanceChange: balanceChange,
	}, { transaction });
}

async function getInventoryItem(inventoryID, itemName, transaction) {
	return await InventoryItem.findOne({ where: { InventoryID: inventoryID, ItemName: itemName }, transaction });
}

async function createOrUpdateInventoryItem(inventoryID, itemName, quantity, transaction) {
	const item = await getInventoryItem(inventoryID, itemName, transaction);
	if (item) {
		item.ItemQuantity += quantity;
		await item.save({ transaction });
	}
	else {
		await InventoryItem.create({ InventoryID: inventoryID, ItemName: itemName, ItemQuantity: quantity }, { transaction });
	}
}

module.exports = { getUserByDiscordID, getInventoryByUserID, createOrUpdateInventory, createAccountActivity, createOrUpdateInventoryItem };
