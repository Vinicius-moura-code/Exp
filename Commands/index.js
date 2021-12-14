const ytdl = require('ytdl-core');
const Servers = require('../Servers');

const Commands = (client) => {
  const prefix = '+';

  client.on('message', async (msg) => {
    //filters
    if (!msg.guild) return;
    if (!msg.content.startsWith(prefix)) return;

    if (!msg.member.voice.channel) {
      msg.channel.send('Entra no canal de voz, fi de rapariga');
      return;
    }

    //comands
    if (msg.content === prefix + 'join') {
      Servers.connection = await msg.member.voice.channel.join();
    }
    if (msg.content === prefix + 'leave') {
      msg.member.voice.channel.leave();
      Servers.connection = null;
      Servers.dispatcher = null;
    }
    /////               Player de musica
    if (msg.content.startsWith(prefix + 'play')) {
      Servers.connection = await msg.member.voice.channel.join();

      let whatSong = msg.content.slice(6);
      if (ytdl.validateURL(whatSong)) {
        Servers.dispatcher = Servers.connection.play(ytdl(whatSong));
      } else {
        msg.channel.send('Esse link não funfa ;-;');
      }

      if (msg.content === prefix + 'pause') {
        Servers.dispatcher.pause();
      }
      if (msg.content === prefix + 'resume') {
        Servers.dispatcher.resume();
      }
    }
  });
};

module.exports= Commands;
