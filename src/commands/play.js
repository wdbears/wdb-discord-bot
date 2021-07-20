import ytdl from 'ytdl-core-discord';
import Queue from '../util/Queue';
import { WdbError } from '../util';

export const name = 'play';
export const description = 'Play the audio from the given URL.';
export const usage = '<URL>';
export const aliases = ['p'];
export const guildOnly = true;
export const voiceOnly = true;

async function play(connection, url) {
  return connection.play(await ytdl(url), {
    type: 'opus',
    filter: 'audioonly'
  });
}

const queue = new Queue();

export async function execute(message, args) {
  try {
    // Voice only works in guilds, if the message does not come from a guild, we ignore it
    if (!message.guild) return;

    let connection;
    let url;
    // Only try to join the sender's voice channel if they are in one themselves
    if (message.member.voice.channel) {
      [url] = args;
      if (!ytdl.validateURL(url)) return message.reply('you must enter a valid URL!');
      connection = await message.member.voice.channel.join();

      let { dispatcher } = connection;
      if (dispatcher && dispatcher.paused) return dispatcher.resume();
      dispatcher = play(connection, url);
      queue.enqueue(dispatcher);
    } else {
      return message.reply('You need to join a voice channel first!');
    }
  } catch (error) {
    throw new WdbError(name, 500);
  }
}
