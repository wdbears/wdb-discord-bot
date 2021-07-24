import ytdl from 'ytdl-core';
import { isNullOrEmpty, WdbError } from '../../util';

export const name = 'play';
export const description = 'Play the audio from the given URL.';
export const usage = '<URL>';
export const aliases = ['p'];
export const guildOnly = true;
export const voiceOnly = true;

function play(message, song) {
  const { queue } = message.client;
  const serverQueue = queue.get(message.guild.id);

  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(message.guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on('finish', () => {
      serverQueue.songs.shift();
      play(message, serverQueue.songs[0]);
    })
    .on('error', (err) => message.channel.send(err));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Now playing **${song.title}**`);
}

export async function execute(message, args) {
  try {
    const url = args[0];
    const { queue } = message.client;
    const serverQueue = queue.get(message.guild.id);
    const voiceChannel = message.member.voice.channel;

    if (isNullOrEmpty(url)) {
      if (serverQueue) {
        if (serverQueue.connection.dispatcher.paused) {
          return serverQueue.connection.dispatcher.resume();
        }
        return message.channel.send('The player is not paused!');
      }
      return message.channel.send('Please enter a song URL!');
    }

    if (!ytdl.validateURL(url)) return message.reply('you must enter a valid URL!');

    const songInfo = await ytdl.getInfo(url);
    const song = {
      title: songInfo.videoDetails.title,
      url: songInfo.videoDetails.video_url
    };

    if (!serverQueue) {
      const queueConstruct = {
        textChannel: message.channel,
        voiceChannel,
        connection: null,
        songs: [],
        volume: 5,
        playing: true
      };

      queue.set(message.guild.id, queueConstruct);

      queueConstruct.songs.push(song);

      try {
        const connection = await voiceChannel.join();
        queueConstruct.connection = connection;
        play(message, queueConstruct.songs[0]);
      } catch (err) {
        queue.delete(message.guild.id);
        return message.channel.send(err);
      }
    } else {
      serverQueue.songs.push(song);
      return message.channel.send(`${song.title} has been added to the queue!`);
    }
  } catch (error) {
    throw new WdbError(name, 400, 'something went wrong trying to play the song!', error);
  }
}
