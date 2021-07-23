import { WdbError } from '../../util';

export const name = 'skip';
export const description = 'Skip the currently playing audio';
export const guildOnly = true;
export const voiceOnly = true;

export async function execute(message) {
  try {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return message.channel.send('There is no song that I could skip!');
    serverQueue.connection.dispatcher.end();
  } catch (error) {
    throw new WdbError(name, 500);
  }
}
