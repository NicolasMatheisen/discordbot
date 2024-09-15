
const { Client, Intents, SlashCommandBuilder, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { Sequelize, DataTypes } = require('sequelize');

const { Kontoinformationen, Transaktionen, sequelize } = require('../database/models.js');

sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

const coinGifs = [
    'https://media3.giphy.com/media/KA8NKtxyZFh72/giphy.gif?cid=6c09b952flsncj09o5ecvk0l3w0jqymctorjaxhnk3fcneqo&ep=v1_internal_gif_by_id&rid=giphy.gif&ct=g',
    'https://media2.giphy.com/media/GNvWw0pDL6QRW/giphy.gif?cid=6c09b952wwply3tvtvfzrqpaoclrpftzxaqzg6vtribh30zb&ep=v1_internal_gif_by_id&rid=giphy.gif&ct=g',
    'https://media0.giphy.com/media/xT1R9TaUQfgf5qQZEY/giphy.gif?cid=6c09b95286rkhb4csb91l2eltdb5hmr5dzv6hwyogmif2ydq&ep=v1_internal_gif_by_id&rid=giphy.gif&ct=g',
    'https://media3.giphy.com/media/xT1R9EICfQ229jdAKA/giphy.gif?cid=6c09b952kzosuv8hrtsvl9yewba7gxolop29znjebi3j89d5&ep=v1_internal_gif_by_id&rid=giphy.gif&ct=g',
    'https://media3.giphy.com/media/rszcYFb1jpNetUHsCf/giphy.gif?cid=6c09b9522vwn964foft2joi9d1gsxnt3v0939fv5xgbg5xi4&ep=v1_internal_gif_by_id&rid=giphy.gif&ct=g',
];

const randomGif = coinGifs[Math.floor(Math.random() * coinGifs.length)];
const embed = new EmbedBuilder()
    .setColor('#ffd700')
    .setTitle(`Du hast deine täglichen Münzen gesammelt <:coins:1279681380875370516>!`)
    .setImage(randomGif)
    .setTimestamp();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('collect')
        .setDescription('Sammel deine täglichen Münzen ein!'),
    async execute(interaction) {
        if (!interaction.isCommand()) return;

        const now = new Date();
        const user = await Kontoinformationen.findOne({ where: { DiscordID: interaction.user.id } });

        if (!user) {
            const newUser = await Kontoinformationen.create({
                DiscordID: interaction.user.id,
                DiscordUsername: interaction.user.username,
                DiscordServerID: interaction.guild.id,
                DiscordServerName: interaction.guild.name,
                Kontostand: 100,
                Timestamp: now,
            });

            await Transaktionen.create({
                KontoinformationID: newUser.ID,
                Transaktion: 'Initial deposit',
                TransaktionsValue: 100,
                Timestamp: now,
            });
        } else {
            user.Kontostand += 100;
            user.Timestamp = now;
            await user.save();

            await Transaktionen.create({
                KontoinformationID: user.ID,
                Transaktion: 'Daily collection',
                TransaktionsValue: 100,
                Timestamp: now,
            });
        }

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};

