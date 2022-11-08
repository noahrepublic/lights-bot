
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
		  axios.post(`http://${process.env.ipAddress}:80/off`)
            .then(r => {
              res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                  content: 'Turned off the lights!'
                }
              });
            })
            .catch(err => {
                res.send({
                  type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                  data: {
                    content: 'You can only send requests every 15 seconds!'
                  }
                });
            })

    }

    if(interaction.data.name == 'set'){
      console.log(interaction.data.options.brightness.value)
		  axios.post(`http://${process.env.ipAddress}:80/${interaction.data.options.hue.value}/${interaction.data.options.saturation.value}/${interaction.data.options.brightness.value}`)
            .then(res => {
                res.send({
                  type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                  data: {
                    content: 'Success!'
                  }
                });
            })
            .catch(err => {
                res.send({
                  type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                  data: {
                    content: 'You can only send requests every 15 seconds!'
                  }
                });
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
			"name": "hue",
			"description": "The hue of the lights (1-65535)",
			"type": 4,
			"required": true
		},
    {
			"name": "brightness",
			"description": "The brightness of the lights (1-254)",
			"type": 4,
			"required": true
		},
		{
			"name": "saturation",
			"description": "The saturation of the lights (0-254) (0 is white)",
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
