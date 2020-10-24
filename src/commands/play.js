import ytdl from 'ytdl-core';

module.exports = {
  name: 'play',
  description: 'Play the audio from the given url.',
  async execute(message, args) {
    const connection = await message.member.voice.channel.join();
    const dispatcher = connection.play(ytdl(args[0]), { filter: 'audioonly' });
    dispatcher.on('finish', () => {
      dispatcher.destroy();
    });
  }
};
