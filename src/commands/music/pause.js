import { WdbError } from '../../util';

export const name = 'pause';
export const description = 'Pause the currently playing audio';
export const guildOnly = true;
export const voiceOnly = true;

export async function execute(message) {
  try {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return message.channel.send('There is no song that I could pause!');
    if (serverQueue.connection.dispatcher.paused) return message.channel.send('Song already paused!');
    serverQueue.connection.dispatcher.pause();
  } catch (error) {
    throw new WdbError(name, 500);
  }
}
