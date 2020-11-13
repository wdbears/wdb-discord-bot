/**
 * Attempt to join a voice channel successfully
 * @param {string} message - The user inputted message
 * @returns {Object} - The connection object
 */

import { WdbError } from '../util';

export default async function joinVoiceChannel(message, command) {
  try {
    return await message.member.voice.channel.join();
  } catch (err) {
    throw new WdbError(
      command,
      400,
      'you must be in a voice channel to play media!'
    );
  }
}
