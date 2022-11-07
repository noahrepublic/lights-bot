
const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('off')
		.setDescription('Turns off the lights!'),
	async execute(interaction) {
        await interaction.deferReply();
		axios.post(`http://${process.env.ipAddress}:80/off`)
            .then(res => {
                interaction.reply(`Success!`);
            })
            .catch(err => {
                interaction.reply(`You can only send requests every 15 seconds!`);
            })

	},
};