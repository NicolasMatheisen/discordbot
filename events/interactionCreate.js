const { Events } = require('discord.js');
const { User, UserServer, Server, AccountActivity, sequelize } = require('../database/models');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				const userId = interaction.user.id;
				const guildId = interaction.guild.id;
				const now = new Date();

				// Füge eine Transaktion hinzu, um die Atomarität sicherzustellen
				await sequelize.transaction(async (t) => {
					let user = await User.findOne({ where: { DiscordUserID: userId }, transaction: t });
					if (!user) {
						user = await User.create({
							DiscordUserID: userId,
						}, { transaction: t });
					}

					// Füge eine Konsolenausgabe hinzu, um die UserID zu überprüfen
					console.log(`UserID: ${user.UserID}`);

					// Überprüfe, ob der Server-Eintrag existiert
					let server = await Server.findOne({ where: { ServerID: guildId }, transaction: t });
					if (!server) {
						server = await Server.create({
							ServerID: guildId,
							ServerName: interaction.guild.name,
						}, { transaction: t });
					}

					// Überprüfe, ob der UserServer-Eintrag existiert
					let userServer = await UserServer.findOne({ where: { UserID: user.UserID, ServerID: guildId }, transaction: t });
					if (!userServer) {
						userServer = await UserServer.create({
							UserID: user.UserID,
							ServerID: guildId,
						}, { transaction: t });
					}

					// Füge eine Konsolenausgabe hinzu, um die UserServerID und UserID zu überprüfen
					console.log(`UserServerID: ${userServer.UserServerID}, UserID: ${userServer.UserID}`);

					// Logge den verwendeten Befehl in AccountActivity, außer es ist der /daily-Befehl
					if (interaction.commandName !== 'daily') {
						await AccountActivity.create({
							InventoryID: null,
							CommandTimestamp: now,
							Command: `/${interaction.commandName}`,
							BalanceChange: 0,
						}, { transaction: t });
					}
				});

				// Nachdem die Event-Logik ausgeführt wurde, führe den eigentlichen Befehl aus
				await command.execute(interaction);

			}
			catch (error) {
				console.error(`Error executing ${interaction.commandName}`);
				console.error(error);
			}
		}
		else if (interaction.isButton()) {
			// Respond to the button
		}
		else if (interaction.isStringSelectMenu()) {
			// Respond to the select menu
		}
	},
};
