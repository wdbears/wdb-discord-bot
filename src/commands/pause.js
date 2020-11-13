import { WdbError } from '../util';

export const name = 'pause';
export const description = 'Pause the currently playing audio';
export const guildOnly = true;

export async function execute(message) {
  try {
    const connection = await message.client.voice.connections.first();
    if (connection) connection.dispatcher.pause();
  } catch (error) {
    throw new WdbError(name, 500, error.message);
  }
}
