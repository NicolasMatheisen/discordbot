const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	const UserServer = sequelize.define('UserServer', {
		UserServerID: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		UserID: {
			type: DataTypes.BIGINT,
			references: {
				model: 'Users',
				key: 'UserID',
			},
			onDelete: 'CASCADE',
		},
		ServerID: {
			type: DataTypes.BIGINT,
			references: {
				model: 'Servers',
				key: 'ServerID',
			},
			onDelete: 'CASCADE',
		},
	});

	UserServer.associate = (models) => {
		UserServer.belongsTo(models.User, { foreignKey: 'UserID' });
		UserServer.belongsTo(models.Server, { foreignKey: 'ServerID' });
	};

	return UserServer;
};
