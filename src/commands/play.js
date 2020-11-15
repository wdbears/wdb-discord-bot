import ytdl from 'ytdl-core';
import { WdbError } from '../util';

export const name = 'play';
export const description = 'Play the audio from the given URL.';
export const usage = '<URL>';
export const aliases = ['p'];
export const guildOnly = true;

export async function execute(message, args) {
  try {
    let connection = message.client.voice.connections.first();
    let dispatcher = connection !== undefined ? connection.dispatcher : undefined;

    if (dispatcher && dispatcher.paused) {
      dispatcher.resume();
      return;
    }

    const url = args[0];
    if (!ytdl.validateURL(url)) throw new WdbError(name, 400, 'you must enter a valid url.');

    if (url && dispatcher === undefined) {
      try {
        connection = await message.member.voice.channel.join();
      } catch (error) {
        throw new WdbError(name, 400, 'you must be in a voice channel to play media!');
      }
      if (connection !== undefined) {
        dispatcher = connection.play(ytdl(url), {
          filter: 'audioonly'
        });
        dispatcher.on('finish', () => {
          connection.disconnect();
        });
      }
    }
  } catch (error) {
    if (error instanceof WdbError) throw error;
    else throw new WdbError(name, 500);
  }
}
