
const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('off')
		.setDescription('Turns off the lights!'),
	async execute(interaction) {
		axios.post(`http://10.0.0.217:8080/off`)
            .then(res => {
                interaction.reply(`Success!`);
            })
            .catch(err => {
                interaction.reply(`You can only send requests every 15 seconds!`);
            })

	},
};