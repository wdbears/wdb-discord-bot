export const name = 'pause';
export const description = 'Pause the currently playing audio';
export const guildOnly = true;

export async function execute(message) {
  try {
    const connection = await message.client.voice.connections.first();
    connection.dispatcher.pause();
  } catch (error) {
    const wdbErrorObj = {
      command: 'play',
      message: 'There was an error trying to pause!'
    };
    throw wdbErrorObj;
  }
}
