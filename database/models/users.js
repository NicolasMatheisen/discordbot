const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	const User = sequelize.define('User', {
		UserID: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true,
		},
		DiscordUserID: {
			type: DataTypes.STRING(50),
			unique: true,
		},
	});

	User.associate = (models) => {
		User.hasMany(models.UserServer, { foreignKey: 'UserID' });
		User.hasOne(models.Inventory, { foreignKey: 'UserID' });
	};

	return User;
};
