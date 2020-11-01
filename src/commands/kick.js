export const name = 'kick';
export const description =
  'Kick the mentioned member out of the voice channel.';
export const aliases = ['kick'];

export async function execute(message) {
  if (message.channel.type === 'DM') {
    message.channel.send('This command can only be used in a server.');
    return;
  }

  if (!message.mentions.members.size) {
    return message.reply('you need to tag a user in order to kick them!');
  }

  const bCanKick = message.member.roles.cache.some(
    (r) => r.id === '484567203169959967' // Admins role id.
  );

  if (!bCanKick) return message.reply('you do not have permission to kick.');

  const taggedMember = message.mentions.members.first();
  try {
    await taggedMember.voice.kick();
    console.log(`Kicked ${taggedMember.displayName}`);
  } catch (error) {
    const wdbErrorObj = {
      command: 'kick',
      message: 'there was an error trying to kick!'
    };

    throw wdbErrorObj;
  }
}
