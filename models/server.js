const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	const Server = sequelize.define('Server', {
		ServerID: {
			type: DataTypes.BIGINT,
			primaryKey: true,
		},
		ServerName: {
			type: DataTypes.STRING(100),
		},
	});

	Server.associate = (models) => {
		Server.hasMany(models.UserServer, { foreignKey: 'ServerID' });
	};

	return Server;
};
