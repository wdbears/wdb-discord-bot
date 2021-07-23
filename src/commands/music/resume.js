import { WdbError } from '../../util';

export const name = 'resume';
export const description = 'Resume the currently paused audio';
export const guildOnly = true;
export const voiceOnly = true;

export async function execute(message) {
  try {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return message.channel.send('There is no song that I could resume!');
    if (!serverQueue.connection.dispatcher.paused) return message.channel.send('Song already resumed!');
    serverQueue.connection.dispatcher.resume();
  } catch (error) {
    throw new WdbError(name, 500);
  }
}
