import ytdl from 'ytdl-core';
import { execute as resume } from './resume';
import { isNullOrEmpty } from '../../util/StringUtil';

export const name = 'play';
export const description = 'Play the audio from the given URL.';
export const usage = '<URL>';
export const aliases = ['p'];
export const guildOnly = true;
export const voiceOnly = true;

function play(message, song) {
  const { queue } = message.client;
  const { guild } = message;
  const serverQueue = queue.get(message.guild.id);

  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
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
    const serverQueue = message.client.queue.get(message.guild.id);
    const voiceChannel = message.member.voice.channel;
    const permissions = voiceChannel.permissionsFor(message.client.user);

    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
      return message.channel.send('I need permission to join and speak in your voice channel!');
    }

    if (serverQueue && serverQueue.connection.dispatcher.paused) return resume(message);
    if (isNullOrEmpty(url) && serverQueue && !serverQueue.connection.dispatcher.paused) return message.channel.send('The player is not paused!');

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
    message.channel.send(error.message);
  }
}
