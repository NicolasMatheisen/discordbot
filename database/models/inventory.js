const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	const Inventory = sequelize.define('Inventory', {
		InventoryID: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		UserID: {
			type: DataTypes.BIGINT,
			unique: true,
			references: {
				model: 'Users',
				key: 'UserID',
			},
			onDelete: 'CASCADE',
		},
		CurrentBalance: {
			type: DataTypes.DECIMAL(10, 2),
		},
	});

	Inventory.associate = (models) => {
		Inventory.belongsTo(models.User, { foreignKey: 'UserID' });
		Inventory.hasMany(models.AccountActivity, { foreignKey: 'InventoryID' });
		Inventory.hasMany(models.InventoryItem, { foreignKey: 'InventoryID' });
	};

	return Inventory;
};
