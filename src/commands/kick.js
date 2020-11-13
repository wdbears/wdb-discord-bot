import { WdbError } from '../util';

export const name = 'kick';
export const description = 'Kick the mentioned user out of the voice channel.';
export const aliases = ['kick'];
export const usage = '[username]';
export const guildOnly = true;
export const adminOnly = true;

export async function execute(message) {
  if (message.channel.type === 'DM') {
    // consider seperate code for DM channels
    throw new WdbError(name, 400, 'This command can only be used in a server.');
  }

  if (!message.mentions.members.size) {
    throw new WdbError(
      name,
      400,
      'you need to tag a user in order to kick them!'
    );
  }

  const bCanKick = message.member.roles.cache.some(
    (r) => r.id === '484567203169959967' // Admin role ID
  );

  if (!bCanKick)
    throw new WdbError(name, 403, 'you do not have permission to kick.');

  const taggedMember = message.mentions.members.first();
  try {
    await taggedMember.voice.kick();
  } catch (error) {
    throw new WdbError(name, 500);
  }
}
