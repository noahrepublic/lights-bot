
const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

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
		axios.post(`http://10.0.0.217:8080/${interaction.options.getInteger('hue')}/${interaction.options.getInteger('saturation')}/${interaction.options.getInteger('brightness')}`)
            .then(res => {
                interaction.reply(`Success!`);
            })
            .catch(err => {
                interaction.reply(`You can only send requests every 15 seconds!`);
            })
	},
};