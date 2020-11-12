import ytdl from 'ytdl-core';
import { joinVoiceChannel } from '../functions';

export const name = 'play';
export const description = 'Play the audio from the given URL.';
export const usage = '<URL>';
export const aliases = ['p'];
export async function execute(message, args) {
  try {
    let connection = message.client.voice.connections.first();
    let dispatcher =
      connection !== undefined ? connection.dispatcher : undefined;

    if (dispatcher && dispatcher.paused) {
      dispatcher.resume();
      return;
    }

    const url = args[0];
    if (!ytdl.validateURL(url)) throw new Error('you must enter a valid url.');

    if (url && dispatcher === undefined) {
      connection = await joinVoiceChannel(message);
      dispatcher = connection.play(ytdl(url), {
        filter: 'audioonly'
      });
      dispatcher.on('finish', () => {
        connection.disconnect();
      });
    }
  } catch (error) {
    // create WdbErrorObj based upon func
    const wdbErrorObj = {
      command: 'play',
      message: error.message
    };

    throw wdbErrorObj;
  }
}
