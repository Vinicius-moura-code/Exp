require('dotenv').config()
const Discord = require('discord.js');

const Commands = require('./Commands/index');

const TOKEN = process.env.TOKEN
const client = new Discord.Client();

client.login(TOKEN);

client.on('ready', () => {
  console.log('o pai ta on');
});

Commands(client);
