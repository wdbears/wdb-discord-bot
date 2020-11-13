/**
 * Attempt to join a voice channel successfully
 * @param {string} message - The user inputted message
 * @returns {Object} - The connection object
 */
export default async function joinVoiceChannel(message) {
  try {
    return await message.member.voice.channel.join();
  } catch (err) {
    throw new Error('you must be in a voice channel to play media!');
  }
}
