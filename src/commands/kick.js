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

  if (!message.member.hasPermission('KICK_MEMBERS')) {
    message.reply('you do not have permission to kick.');
    return;
  }

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
