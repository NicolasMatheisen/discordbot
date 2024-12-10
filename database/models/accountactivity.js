const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	const AccountActivity = sequelize.define('AccountActivity', {
		ActivityID: {
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
		CommandTimestamp: {
			type: DataTypes.DATE,
		},
		Command: {
			type: DataTypes.STRING(255),
		},
		BalanceChange: {
			type: DataTypes.DECIMAL(10, 2),
		},
	});

	AccountActivity.associate = (models) => {
		AccountActivity.belongsTo(models.Inventory, { foreignKey: 'InventoryID' });
	};

	return AccountActivity;
};
