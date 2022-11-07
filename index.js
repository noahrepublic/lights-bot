const fs = require('node:fs');
const path = require('node:path');
const axios = require('axios');
const express = require('express');
const app = express();
require('dotenv').config();

const { InteractionType, InteractionResponseType, verifyKeyMiddleware } = require('discord-interactions');

const discord_api = axios.create({
	baseURL: 'https://discord.com/api/',
	timeout: 3000,
	headers: {
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
		"Access-Control-Allow-Headers": "Authorization",
		Authorization: `Bot ${process.env.token}`,
	}
});




app.post('/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY), async(req, res) => {
	const interaction = req.body;
	
	if (interaction.type === InteractionType.ApplicationCommand) {
		const command = client.commands.get(interaction.data.name);
		if (!command) return;
		
		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			await interaction.editReply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

app.get('/register_commands', async(req, res) => {
	const commands = [];
// Grab all the command files from the commands directory you created earlier
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(token);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, process.env.GUILD_ID),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
	
});

app.listen(8999, () => {
	console.log('Listening on port 8999');
	});