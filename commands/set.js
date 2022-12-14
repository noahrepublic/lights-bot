
const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('set')
		.setDescription('Sets the lights colors!')
        .addIntegerOption(option =>
            option.setName('brightness')
                .setDescription('The brightness of the lights')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('hue')
                .setDescription('The hue of the lights')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('saturation')
                .setDescription('The saturation of the lights')
                .setRequired(true)),
	async execute(interaction) {
        await interaction.deferReply();
		axios.post(`http://${process.env.ipAddress}:80/${interaction.options.getInteger('hue')}/${interaction.options.getInteger('saturation')}/${interaction.options.getInteger('brightness')}`)
            .then(res => {
                interaction.editReply(`Success!`);
            })
            .catch(err => {
                interaction.editReply(`You can only send requests every 15 seconds!`);
            })
	},
};