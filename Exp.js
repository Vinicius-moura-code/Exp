const Discord = require('discord.js');

const Commands = require('./Commands/index');

const TOKEN = 'OTIwMTU1Mjk5ODU4NTA5OTE0.YbgPZw.lmyc4W_CakUeywXD4mBj4S52Hi4';
const client = new Discord.Client();

client.login(TOKEN);

client.on('ready', () => {
  console.log('o pai ta on');
});

Commands(client);
