const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	const InventoryItem = sequelize.define('InventoryItem', {
		InventoryItemID: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		InventoryID: {
			type: DataTypes.INTEGER,
			references: {
				model: 'Inventories',
				key: 'InventoryID',
			},
			onDelete: 'CASCADE',
		},
		ItemName: {
			type: DataTypes.STRING(255),
		},
		ItemQuantity: {
			type: DataTypes.INTEGER,
		},
	});

	InventoryItem.associate = (models) => {
		InventoryItem.belongsTo(models.Inventory, { foreignKey: 'InventoryID' });
	};

	return InventoryItem;
};
