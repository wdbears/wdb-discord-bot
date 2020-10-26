import ytdl from 'ytdl-core';

// Returns the connection object on successful join
async function joinVoiceChannel(message) {
  try {
    return await message.member.voice.channel.join();
  } catch (err) {
    throw new Error('You must be in a voice channel to play media!');
  }
}

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
    if (!ytdl.validateURL(url)) throw new Error('You must enter a valid url.');

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
