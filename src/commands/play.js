import ytdl from 'ytdl-core';

module.exports = {
  name: 'play',
  description: 'Play the audio from the given url.',
  async execute(message, args) {
    try {
      const url = args[0];
      const connection = await message.member.voice.channel.join();
      const dispatcher = connection.play(ytdl(url), {
        filter: 'audioonly'
      });
      dispatcher.on('finish', () => {
        dispatcher.destroy();
      });
    } catch (error) {
      console.log(error);
    }
  }
};
