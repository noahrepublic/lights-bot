
require('dotenv').config()
const APPLICATION_ID = process.env.clientId 
const TOKEN = process.env.token 
const PUBLIC_KEY = process.env.PUBLIC_KEY || 'not set'
const GUILD_ID = process.env.GUILD_ID 


const axios = require('axios')
const express = require('express');
const { InteractionType, InteractionResponseType, verifyKeyMiddleware } = require('discord-interactions');


const app = express();
// app.use(bodyParser.json());

const discord_api = axios.create({
  baseURL: 'https://discord.com/api/',
  timeout: 3000,
  headers: {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
	"Access-Control-Allow-Headers": "Authorization",
	"Authorization": `Bot ${TOKEN}`
  }
});




app.post('/interactions', verifyKeyMiddleware(PUBLIC_KEY), async (req, res) => {
  const interaction = req.body;

  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    console.log(interaction.data.name)
    if(interaction.data.name == 'off'){
		await interaction.deferReply();
		axios.post(`http://${process.env.ipAddress}:80/off`)
            .then(res => {
                interaction.editReply(`Success!`);
            })
            .catch(err => {
                interaction.editReply(`You can only send requests every 15 seconds!`);
            })

    }

    if(interaction.data.name == 'dm'){
		await interaction.deferReply();
		axios.post(`http://${process.env.ipAddress}:80/${interaction.options.getInteger('hue')}/${interaction.options.getInteger('saturation')}/${interaction.options.getInteger('brightness')}`)
            .then(res => {
                interaction.editReply(`Success!`);
            })
            .catch(err => {
                interaction.editReply(`You can only send requests every 15 seconds!`);
            })
    }
  }

});



app.get('/register_commands', async (req,res) =>{
  let slash_commands = [
    {
      "name": "off",
      "description": "Turns off the lights!",
      "options": []
    },
    {
      "name": "set",
      "description": "Sets the lights colors!",
      "options": [
		{
			"name": "brightness",
			"description": "The brightness of the lights",
			"type": 4,
			"required": true
		},
		{
			"name": "hue",
			"description": "The hue of the lights",
			"type": 4,
			"required": true
		},
		{
			"name": "saturation",
			"description": "The saturation of the lights",
			"type": 4,
			"required": true
		}
	  ]
    }
  ]
  try
  {
    // api docs - https://discord.com/developers/docs/interactions/application-commands#create-global-application-command
    let discord_response = await discord_api.put(
      `/applications/${APPLICATION_ID}/guilds/${GUILD_ID}/commands`,
      slash_commands
    )
    console.log(discord_response.data)
    return res.send('commands have been registered')
  }catch(e){
    console.error(e.code)
    console.error(e.response?.data)
    return res.send(`${e.code} error from discord`)
  }
})


app.get('/', async (req,res) =>{
  return res.send('Follow documentation ')
})


app.listen(8999, () => {

})
