require('dotenv').config();
const ytdl = require('ytdl-core');
const Servers = require('../Servers');
const Discord = require('discord.js');
const google = require('googleapis');

const youtube = new google.youtube_v3.Youtube({
  version: 'v3',
  auth: process.env.GOOGLE_TOKEN,
});

let connection = Servers.connection;
let dispatcher = Servers.dispatcher;
let isRunning = Servers.isRunning;
let queue = Servers.queue;
let running = [];
let whatSong = '';
let listResult = [];

const playSongs = () => {
  if (isRunning === false) {
    isRunning = true;
    running = queue[0];

    dispatcher = connection.play(ytdl(running, { filter: 'audioonly' }));

    dispatcher.on('finish', () => {
      isRunning = false;

      if (queue.length > 0) {
        queue.shift();
        playSongs();
      } else {
        dispatcher = null;
      }
    });
  }
};

const Commands = (client, prefix) => {
  client.on('message', async (msg) => {
    //filters
    if (!msg.guild) return;
    if (!msg.content.startsWith(prefix)) return;

    //comands
    if (msg.content === `${prefix}join`) {
      try {
        connection = await msg.member.voice.channel.join();
      } catch (err) {
        console.error('Erro para se conectar no canal 😬');
      }
    }

    if (msg.content === `${prefix}leave`) {
      msg.member.voice.channel.leave();
      connection = null;
      dispatcher = null;
      isRunning = false;
      queue = null;
    }

    //--------------------- Player de musica ---------------------\\
    if (msg.content.startsWith(`${prefix}play`)) {
      if (!msg.member.voice.channel) {
        msg.channel.send('Entra no canal de voz, fi de rapariga');
        return;
      }

      if (connection === null) {
        try {
          connection = await msg.member.voice.channel.join();
        } catch (err) {
          console.log('Erro para se conectar no canal 😬');
          console.log(err);
        }
      }

      whatSong = msg.content.replace(`${prefix}play`, '');

      if (whatSong.length === 0) {
        msg.channel.send('Quer que eu adivinhe a musica? desgraçaaaa');
      }

      if (ytdl.validateURL(whatSong)) {
        queue.push(whatSong);
        msg.channel.send('`' + `Adicionado : ${whatSong}` + '`');
        playSongs();
      } else {
        youtube.search.list(
          {
            q: whatSong.trim(),
            part: 'snippet',
            fields: 'items(id(videoId), snippet(title, channelTitle))',
            type: 'video',
          },
          function (err, result) {
            if (err) {
              console.error(err);
            }
            if (result) {
              for (let i in result.data.items) {
                const buildItem = {
                  titulo: result.data.items[i].snippet.title,
                  canalName: result.data.items[i].snippet.channelTitle,
                  id: `https://www.youtube.com/watch?v=${result.data.items[i].id.videoId}`,
                };

                listResult.push(buildItem);
              }

              const embed = new Discord.MessageEmbed()
                .setColor([100, 65, 165])
                .setAuthor('Bardo')
                .setDescription('Escolhe a track disgrama');

              for (let i in listResult) {
                embed.addField(
                  `${parseInt(i) + 1} : ${listResult[i].titulo}`,
                  `${listResult[i].canalName}`
                );
              }

              msg.channel.send(embed).then((embedMessage) => {
                const possibleReacts = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];

                for (let i = 0; i < possibleReacts.length; i++) {
                  embedMessage.react(possibleReacts[i]);
                }
                const filter = (reaction, user) => {
                  return (
                    possibleReacts.includes(reaction.emoji.name) &&
                    user.id === msg.author.id
                  );
                };

                embedMessage
                  .awaitReactions(filter, {
                    max: 1,
                    time: 20000,
                    errors: ['time'],
                  })
                  .then((collected) => {
                    const reaction = collected.first();
                    const idOption = possibleReacts.indexOf(
                      reaction.emoji.name
                    );

                    msg.channel.send(
                      `Essa  ${listResult[idOption].titulo} é boa, nice escolha 👌`
                    );
                    msg.channel.send('.cleanup bot');

                    queue.push(listResult[idOption].id);
                    playSongs();
                    queue = null;
                  })
                  .catch((error) => {
                    msg.reply(
                      'Ocê escolheu errado, a culpa é sua n minha! Bakaaaaaaaa '
                    );
                    console.error(error + 'Erro do catch do youtube search');
                  });
              });
            }
          }
        );
      }
    }

    if (msg.content === `${prefix}pause`) {
      dispatcher.pause();
    }
    if (msg.content === `${prefix}resume`) {
      dispatcher.resume();
    }
  });
};

module.exports = Commands;
