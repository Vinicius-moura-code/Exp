require('dotenv').config();
const Discord = require('discord.js');
const Commands = require('./Commands/index');

let state = false;
const client = new Discord.Client();
const prefix = '+';

client.on('ready', () => {
  console.log('o pai ta on');
  state = true;
});

Commands(client, prefix);

client.login(process.env.TOKEN);
