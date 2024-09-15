const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database/database.sqlite'
});

const Kontoinformationen = sequelize.define('Kontoinformationen', {
    ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    DiscordID: {
        type: DataTypes.STRING,
        allowNull: false
    },
    DiscordUsername: {
        type: DataTypes.STRING,
        allowNull: false
    },
    DiscordServerID: {
        type: DataTypes.STRING,
        allowNull: false
    },
    DiscordServerName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Kontostand: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Timestamp: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    }
});

const Transaktionen = sequelize.define('Transaktionen', {
    KontoinformationID: {
        type: DataTypes.INTEGER,
        references: {
            model: Kontoinformationen,
            key: 'ID'
        },
        allowNull: false
    },
    Transaktion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    TransaktionsValue: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Timestamp: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    }
});

// Synchronize all defined models to the DB
sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database & tables created!');
    })
    .catch(error => {
        console.error('Error creating database & tables:', error);
    });

module.exports = { Kontoinformationen, Transaktionen, sequelize };

