import ytdl from 'ytdl-core';

// Returns the connection object on successful join
async function joinVoiceChannel(message) {
  try {
    return await message.member.voice.channel.join();
  } catch (err) {
    const wdbErrorObj = {
      msg: 'You must be in a voice channel to play media!'
    };
    console.log(wdbErrorObj.msg);
    throw wdbErrorObj;
  }
}

module.exports = {
  name: 'play',
  description: 'Play the audio from the given url.',
  async execute(message, args) {
    try {
      const url = args[0];
      let connection = message.client.voice.connections.first();
      let dispatcher =
        connection !== undefined ? connection.dispatcher : undefined;

      if (url && dispatcher === undefined) {
        connection = await joinVoiceChannel(message);
        dispatcher = connection.play(ytdl(url), {
          filter: 'audioonly'
        });
        dispatcher.on('finish', () => {
          connection.disconnect();
        });
      } else if (dispatcher && dispatcher.paused) {
        dispatcher.resume();
      }
    } catch (error) {
      if (error.msg) message.channel.send(error.msg);
      else console.log(error);
    }
  }
};
