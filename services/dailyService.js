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
		return await createInventory(userID, balanceChange, transaction);
	}
	return await updateInventory(inventory, balanceChange, transaction);
}

async function createInventory(userID, balanceChange, transaction) {
	return await Inventory.create({ UserID: userID, CurrentBalance: balanceChange }, { transaction });
}

async function updateInventory(inventory, balanceChange, transaction) {
	inventory.CurrentBalance += balanceChange;
	await inventory.save({ transaction });
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
		return await updateInventoryItem(item, quantity, transaction);
	}
	return await createInventoryItem(inventoryID, itemName, quantity, transaction);
}

async function createInventoryItem(inventoryID, itemName, quantity, transaction) {
	return await InventoryItem.create({ InventoryID: inventoryID, ItemName: itemName, ItemQuantity: quantity }, { transaction });
}

async function updateInventoryItem(item, quantity, transaction) {
	item.ItemQuantity += quantity;
	await item.save({ transaction });
	return item;
}

module.exports = { getUserByDiscordID, getInventoryByUserID, createOrUpdateInventory, createAccountActivity, createOrUpdateInventoryItem };
