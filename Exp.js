require('dotenv').config();
const Discord = require('discord.js');
const Commands = require('./Commands/index');


const client = new Discord.Client();
const prefix = '+';

client.on('ready', () => {
  console.log('o pai ta on');
});

Commands(client, prefix);

client.login(process.env.TOKEN);
