<p align="center">
    <img src="Diabo.png" width="25%">
</p>
<h1 align="center">Lucifer Discord Bot</h1>

This is a discord bot I made for a friend's server, it adds a few helpful commands, does some role management and plays music using a dedicated text channel.

## Deploying your own

The bot requires the following environment variables to be set:

| Name        | Value                                                     |
| ----------- | --------------------------------------------------------- |
| BOT_TOKEN   | The bot's token                                           |
| BOT_CHANNEL | The id of the text channel used for music                 |
| BOT_PREFIX  | The prefix used before a command (optional, default is !) |

You should at least change the role management to work with your server, and probably also translate the messages to your language.

### Local development

Create a `.env` file with your environment variables (usually different from the ones you use in heroku).

Call `npm install` to install the packages, `npm start` to start the bot or `npm run dev` to start the bot, reloading whenever you change something in the code.

### Heroku

The bot is already setup to be deployed on heroku, simply set the environment variables.
