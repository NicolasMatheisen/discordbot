const { Events, EmbedBuilder } = require('discord.js');
const { Kontoinformationen, Transaktionen, sequelize } = require('../database/models.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isCommand()) return;

        const logChannel = interaction.guild.channels.cache.get('1270137964390912090');
        if (!logChannel) return;

        const userInfo = interaction.user; 
        const user = userInfo ? userInfo.username : 'N/A';
        const server = userInfo ? interaction.guild.name : 'N/A';
        
        const transactionRecord = await Transaktionen.findOne({ where: { KontoinformationID: userInfo.id } });
        const transactionsValue = transactionRecord ? transactionRecord.TransaktionsValue : 0; 

        const command = interaction.commandName;
        const transactions = []; 
        const details = transactions.length > 0 ? transactions.map(transaction => `Transaktion: ${transaction.Transaktion}, Wert: ${transaction.TransaktionsValue}`).join('\n') : 'No transactions found';
        const timestamp = new Date().toISOString();

        const embed = new EmbedBuilder()
            .setTitle('User Aktivitäts-Log')
            .setColor(3447003)
            .addFields(
                { name: 'Benutzer', value: user, inline: true },
                { name: 'Server', value: server, inline: true },
                { name: 'Verdient/Ausgegeben', value: transactionsValue.toString(), inline: true },
                { name: 'Befehl', value: command, inline: false },
                { name: 'Details', value: details, inline: false },
                { name: 'Zeitstempel', value: timestamp, inline: false }
            );

        logChannel.send({ embeds: [embed] });
    },
};

