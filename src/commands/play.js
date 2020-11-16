import ytdl from 'ytdl-core-discord';
// import { WdbError } from '../util';

export const name = 'play';
export const description = 'Play the audio from the given URL.';
export const usage = '<URL>';
export const aliases = ['p'];
export const guildOnly = true;
export const voiceOnly = true;

async function play(connection, url) {
  return connection.play(await ytdl(url), {
    type: 'opus',
    filter: 'audioonly'
  });
}

export async function execute(message, args) {
  try {
    const connection = await message.member.voice.channel.join();

    console.log('i got up to here!');
    let { dispatcher } = connection;
    console.log('dispatcher is gucci');

    if (dispatcher && dispatcher.paused) return dispatcher.resume();

    const url = args[0];
    if (!ytdl.validateURL(url)) return message.reply('you must enter a valid URL!');

    console.log('made it to here!');
    dispatcher = play(connection, url);
    console.log(dispatcher);
  } catch (error) {
    console.log(error);
    // if (error instanceof WdbError) throw error;
    // else throw new WdbError(name, 500);
  }
}
