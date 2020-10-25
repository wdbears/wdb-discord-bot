module.exports = {
  name: 'pause',
  description: 'Pause the currently playing audio',
  async execute(message) {
    try {
      const connection = await message.client.voice.connections.first();
      connection.dispatcher.pause();
    } catch (error) {
      console.log(error);
    }
  }
};
